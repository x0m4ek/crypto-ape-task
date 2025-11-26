'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function authorizeUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Missing credentials' }
  }

  const payload = await getPayload({ config })

  try {
    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
    }
  } catch (error) {
    console.error('Login failed', error)
    return { error: 'Invalid credentials' }
  }
  
  redirect('/')
}
