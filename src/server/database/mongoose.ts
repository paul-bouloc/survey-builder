import { serverEnv } from '@/server/config/env'
import mongoose from 'mongoose'

const uri = serverEnv.MONGODB_URI
const databaseName =
  serverEnv.MONGO_DATABASE || uri.split('/').pop()?.split('?')[0] || ''

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }

    cached.promise = mongoose.connect(uri, opts).then(mongoose => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB

/**
 * Get the database name
 */
export function getDatabaseName(): string {
  return databaseName
}
