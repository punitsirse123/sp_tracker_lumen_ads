import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const { db } = await connectToDatabase()

    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user: User = { email, password: hashedPassword, requestsRemaining: 100 }
    await db.collection('users').insertOne(user)

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error', error)
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 })
  }
}

