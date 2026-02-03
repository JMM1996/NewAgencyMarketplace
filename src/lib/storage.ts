import { createClient } from '@supabase/supabase-js'

// Create a Supabase client for storage operations
// Uses service role key for server-side uploads (bypasses RLS)
let storageClient: ReturnType<typeof createClient> | null = null

function getStorageClient() {
  if (!storageClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    // Use service role key for server-side operations, fall back to anon key
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

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
      // Provide more helpful error messages
      if (error.message?.includes('Bucket not found')) {
        console.error(`Storage bucket "${bucket}" not found. Please create it in Supabase dashboard.`)
        throw new Error(`Storage not configured. Please contact support.`)
      }
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        console.error('Storage RLS policy error:', error)
        throw new Error('Permission denied. Please contact support.')
      }
      throw error
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
