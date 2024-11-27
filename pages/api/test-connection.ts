import { connectToDatabase } from '@/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase()
    // Check connection by pinging the database
    await db.command({ ping: 1 })
    res.status(200).json({ message: 'Connected to MongoDB' })
  } catch (error) {
    console.error('Connection error:', error)
    res.status(500).json({ message: 'Failed to connect to MongoDB', error: error.message })
  }
}