# Supabase Storage Setup for Production

## Overview

CareConnect uses Supabase Storage for storing sensitive documents:
- DBS Certificates
- Right to Work documents
- Qualification certificates

## Bucket Configuration

### Create the `documents` bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `documents`
3. Settings:
   - **Public bucket**: ON (allows public URL access for viewing)
   - **File size limit**: 5MB (optional)
   - **Allowed MIME types**: `image/jpeg, image/png, application/pdf` (optional)

## Row Level Security (RLS) Policies

### Development Policies (Current)

For development/testing, we use permissive policies:

```sql
-- INSERT: Allow anyone to upload (development only)
CREATE POLICY "Allow anon uploads" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'documents');
```

### Production Policies

**IMPORTANT**: Before going live, replace the development policies with these secure policies.

#### 1. Delete existing policies

In Supabase Dashboard → Storage → documents → Policies, delete all existing policies.

#### 2. Create production policies

**Policy 1: Authenticated users can upload to their own folder**

```sql
CREATE POLICY "Users can upload own documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2: Users can view their own documents**

```sql
CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 3: Users can update their own documents**

```sql
CREATE POLICY "Users can update own documents" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 4: Users can delete their own documents**

```sql
CREATE POLICY "Users can delete own documents" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Environment Variables

### Required for Production

```env
# Supabase Service Role Key (REQUIRED for production)
# This key bypasses RLS and is used for admin operations
# Get from: Supabase Dashboard → Settings → API → service_role
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Security Notes:**
- NEVER expose the service role key to the client/browser
- NEVER commit the real key to version control
- Use environment variables in your hosting platform (Vercel, etc.)

## File Path Structure

Documents are stored with the following path structure:

```
documents/
  {userId}/
    dbs/
      {timestamp}.{ext}
    right-to-work/
      {timestamp}.{ext}
    qualification/
      {timestamp}.{ext}
```

This structure ensures:
- Each user's documents are in their own folder
- RLS policies can restrict access based on the folder name matching the user ID
- Admins using the service role key can access all documents for verification

## Admin Access

Admin users (for document verification) access documents through the server-side API which uses the service role key. This bypasses RLS policies, allowing admins to:
- View all uploaded documents
- Verify/approve documents
- Delete inappropriate uploads

## Testing Checklist

Before going live:

- [ ] Service role key is set in production environment
- [ ] Development anon policies are removed
- [ ] Production policies are created
- [ ] Test: User can upload documents
- [ ] Test: User can view their own documents
- [ ] Test: User cannot view other users' documents
- [ ] Test: Admin can view all documents via dashboard
