import { NextResponse } from 'next/server'
import axios from 'axios'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'

const scrapeMarketplace = async (url: string) => {
  const apiUrl = `http://api.scrape.do?token=${process.env.SCRAPE_DO_TOKEN}&url=${encodeURIComponent(url)}`
  const response = await axios.get(apiUrl)
  return response.data
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { marketplace, keyword } = await request.json()
    const { db } = await connectToDatabase()

    const user = await db.collection('users').findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (user.requestsRemaining <= 0) {
      return NextResponse.json({ message: 'No requests remaining' }, { status: 403 })
    }

    const url = `https://${marketplace}/s?k=${encodeURIComponent(keyword)}`
    const scrapedData = await scrapeMarketplace(url)

    await db.collection('users').updateOne(
      { _id: userId },
      { $inc: { requestsRemaining: -1 } }
    )

    return NextResponse.json({
      scrapedData,
      requestsRemaining: user.requestsRemaining - 1
    })
  } catch (error) {
    console.error('Scraping error', error)
    return NextResponse.json({ message: 'Error scraping marketplace' }, { status: 500 })
  }
}

