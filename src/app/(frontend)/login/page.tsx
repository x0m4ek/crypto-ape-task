'use client'

import React, { useActionState } from 'react'
import { authorizeUser } from '@/server/actions/authorizeUser'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(authorizeUser, null)

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Login</h1>
      <form action={formAction}>
        {state?.error && (
            <div style={{ marginBottom: '15px', color: 'red' }}>
                {state.error}
            </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input type="email" name="email" id="email" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input type="password" name="password" id="password" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" disabled={isPending} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isPending ? 0.7 : 1 }}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
