import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL

let cachedClient = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }
  
  try {
    const client = await MongoClient.connect(MONGO_URL, {
      maxPoolSize: 10,
      minPoolSize: 5,
    })
    cachedClient = client
    console.log('✅ Connected to MongoDB')
    return client
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

// Contact form submission
export async function POST(request) {
  try {
    const url = new URL(request.url)
    const path = url.pathname.replace('/api/', '')
    
    if (path === 'contact') {
      const body = await request.json()
      const { name, email, message } = body
      
      // Validation
      if (!name || !email || !message) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        )
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        )
      }
      
      // Connect to database
      const client = await connectToDatabase()
      const db = client.db('portfolio')
      const collection = db.collection('contacts')
      
      // Create contact document
      const contactDoc = {
        id: uuidv4(),
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
        status: 'new'
      }
      
      // Insert into database
      await collection.insertOne(contactDoc)
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message sent successfully',
          id: contactDoc.id
        },
        { status: 200 }
      )
    }
    
    return NextResponse.json(
      { error: 'Endpoint not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Get all contacts (optional - for admin)
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const path = url.pathname.replace('/api/', '')
    
    if (path === 'contacts') {
      const client = await connectToDatabase()
      const db = client.db('portfolio')
      const collection = db.collection('contacts')
      
      const contacts = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray()
      
      return NextResponse.json(
        { success: true, contacts },
        { status: 200 }
      )
    }
    
    return NextResponse.json(
      { error: 'Endpoint not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}