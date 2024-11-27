import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const { db } = await connectToDatabase()

    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    return NextResponse.json({ token, userId: user._id })
  } catch (error) {
    console.error('Login error', error)
    return NextResponse.json({ message: 'Error logging in' }, { status: 500 })
  }
}

