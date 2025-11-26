'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const categoryId = formData.get('category') as string

  const payload = await getPayload({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return { error: 'Unauthorized' }
  }

  // Verify user
  const { user } = await payload.auth({ headers: new Headers({ Cookie: `payload-token=${token}` }) })

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    await payload.create({
      collection: 'posts',
      data: {
        title,
        slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        content: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: content,
                                version: 1
                            }
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        textFormat: 0,
                        version: 1
                    }
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1
            }
        },
        owner: user.id,
        categories: categoryId ? [categoryId] : [],
      },
    })
  } catch (error) {
    console.error(error)
    return { error: 'Failed to create post' }
  }
  
  redirect('/')
}
