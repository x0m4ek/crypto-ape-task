import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'
import { Category, Post } from '@/payload-types'
import CreatePostForm from '@/components/CreatePostForm'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome</h1>
            <p>Please <Link href="/login">login</Link> to continue.</p>
        </div>
    )
  }

  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  const posts = await payload.find({
    collection: 'posts',
    limit: 10,
    sort: '-createdAt',
  })

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1>Hello {user.email}</h1>
      
      <CreatePostForm categories={categories.docs as Category[]} />

      <div style={{ marginTop: '40px' }}>
        <h2>Recent Posts</h2>
        {posts.docs.map((post: Post) => {
            // Simple helper to extract text from Lexical JSON
            const contentText = post.content?.root?.children?.map((child) => {
                if (child.type === 'paragraph' && 'children' in child && Array.isArray(child.children)) {
                    return child.children.map((textNode) => {
                        if ('text' in textNode && typeof textNode.text === 'string') {
                            return textNode.text
                        }
                        return ''
                    }).join('')
                }
                return ''
            }).join('\n') || 'No content'

            return (
                <div key={post.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee' }}>
                    <h3>{post.title}</h3>
                    {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
                        <div style={{ marginBottom: '10px', fontSize: '0.9em', color: '#666' }}>
                            Categories: {post.categories.map((cat) => {
                                if (typeof cat === 'object' && cat !== null && 'title' in cat) {
                                    return cat.title
                                }
                                return 'Unknown'
                            }).join(', ')}
                        </div>
                    )}
                    <p style={{ whiteSpace: 'pre-wrap' }}>{contentText}</p>
                </div>
            )
        })}
      </div>
    </div>
  )
}
