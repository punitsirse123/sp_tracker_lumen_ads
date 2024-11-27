import jwt from 'jsonwebtoken'

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return (decoded as any).id
  } catch (error) {
    return null
  }
}

