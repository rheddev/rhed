// middleware/auth.ts
import * as jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function authenticateRequest() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    return false
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!)
    return decoded
  } catch {
    return false
  }
}