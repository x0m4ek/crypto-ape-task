'use client'

import React, { useActionState } from 'react'
import { createPost } from '@/server/actions/createPost'
import { Category } from '@/payload-types'

export default function CreatePostForm({ categories }: { categories: Category[] }) {
  const [state, formAction, isPending] = useActionState(createPost, null)

  return (
    <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h2>Create Post</h2>
      <form action={formAction}>
        {state?.error && (
            <div style={{ marginBottom: '15px', color: 'red' }}>
                {state.error}
            </div>
        )}
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
            <input type="text" name="title" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
            <select name="category" style={{ width: '100%', padding: '8px' }}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
            </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Content</label>
            <textarea name="content" rows={5} required style={{ width: '100%', padding: '8px' }}></textarea>
        </div>
        <button type="submit" disabled={isPending} style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
