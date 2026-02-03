import { createClient } from '@supabase/supabase-js'

// Create a Supabase client for storage operations
// Uses service role key for server-side uploads (bypasses RLS)
let storageClient: ReturnType<typeof createClient> | null = null

function getStorageClient() {
  if (!storageClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    // Use service role key for server-side operations
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL not configured')
    }

    if (!supabaseKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not found - storage uploads will fail')
      throw new Error('Storage not configured. Please add SUPABASE_SERVICE_ROLE_KEY to .env')
    }

    // Check if it's still a placeholder
    if (supabaseKey.includes('your-') || supabaseKey.length < 100) {
      console.error('SUPABASE_SERVICE_ROLE_KEY appears to be a placeholder or invalid')
      console.error('Key length:', supabaseKey.length, '(should be ~200+ characters)')
      throw new Error('Invalid service role key. Please update SUPABASE_SERVICE_ROLE_KEY in .env')
    }

    console.log('Storage client initialized with service role key (length:', supabaseKey.length, ')')
    storageClient = createClient(supabaseUrl, supabaseKey)
  }
  return storageClient
}

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
} as const

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File
): Promise<{ url: string; error: Error | null }> {
  try {
    const client = getStorageClient()

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await client.storage
      .from(bucket)
      .upload(path, buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      })

    if (error) {
      // Log the full error for debugging
      console.error('Supabase storage error:', {
        message: error.message,
        name: error.name,
        cause: error.cause,
        fullError: JSON.stringify(error, null, 2)
      })

      // Provide more helpful error messages
      if (error.message?.includes('Bucket not found')) {
        throw new Error(`Storage bucket "${bucket}" not found. Create it in Supabase dashboard.`)
      }
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        throw new Error('RLS policy error - check Supabase storage policies')
      }
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get the public URL
    const { data: urlData } = client.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { url: '', error: error as Error }
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const client = getStorageClient()

    const { error } = await client.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw error
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting file:', error)
    return { success: false, error: error as Error }
  }
}

/**
 * Generate a unique file path for uploads
 */
export function generateFilePath(
  userId: string,
  documentType: 'dbs' | 'right-to-work' | 'qualification',
  originalFilename: string
): string {
  const timestamp = Date.now()
  const ext = originalFilename.split('.').pop() || 'pdf'
  return `${userId}/${documentType}/${timestamp}.${ext}`
}

/**
 * Get the file path from a full URL
 */
export function getPathFromUrl(url: string): string {
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/storage/v1/object/public/')
  if (pathParts.length > 1) {
    return pathParts[1].split('/').slice(1).join('/')
  }
  return ''
}
