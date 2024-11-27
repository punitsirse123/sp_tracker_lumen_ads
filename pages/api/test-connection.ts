import { connectToDatabase } from '@/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase()
    // Attempt to list collections to verify connection
    const collections = await db.listCollections().toArray()
    res.status(200).json({ message: 'Connected to MongoDB', collections })
  } catch (error) {
    console.error('Connection error:', error)
    res.status(500).json({ message: 'Failed to connect to MongoDB', error: error.message })
  }
}