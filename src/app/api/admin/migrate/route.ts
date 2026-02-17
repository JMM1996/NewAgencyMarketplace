import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - Run database migration for conversations table
export async function POST() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create conversations table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "conversations" (
        "id" TEXT NOT NULL,
        "participant1Id" TEXT NOT NULL,
        "participant2Id" TEXT NOT NULL,
        "bookingId" TEXT,
        "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
      );
    `)

    // Add unique constraint if not exists
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'conversations_participant1Id_participant2Id_key'
        ) THEN
          ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant1Id_participant2Id_key" UNIQUE ("participant1Id", "participant2Id");
        END IF;
      END $$;
    `)

    // Add foreign keys if not exist
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'conversations_participant1Id_fkey'
        ) THEN
          ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;
    `)

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'conversations_participant2Id_fkey'
        ) THEN
          ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;
    `)

    // Create indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "conversations_participant1Id_idx" ON "conversations"("participant1Id");
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "conversations_participant2Id_idx" ON "conversations"("participant2Id");
    `)

    // Now update the messages table to add conversationId column if not exists
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'messages' AND column_name = 'conversationId'
        ) THEN
          ALTER TABLE "messages" ADD COLUMN "conversationId" TEXT;
          ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");
        END IF;
      END $$;
    `)

    return NextResponse.json({ success: true, message: 'Migration completed successfully' })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: String(error) },
      { status: 500 }
    )
  }
}
