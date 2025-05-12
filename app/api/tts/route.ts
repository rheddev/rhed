import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { ttsMessagesTable } from '@/db/schema'
import { NextResponse } from 'next/server'

// WebSocket connection
const TTS_WEBSOCKET_URL = process.env.TTS_WEBSOCKET_URL || 'ws://localhost:8080'

export async function POST(request: Request) {
    try {
        const { name, amount, message } = await request.json()

        if (!name || !amount || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Store in database
        const client = postgres(process.env.DATABASE_URL!)
        const db = drizzle(client)

        const result = await db.insert(ttsMessagesTable).values({
            name,
            amount,
            message
        }).returning()

        // Send to WebSocket
        try {
            const ws = new WebSocket(TTS_WEBSOCKET_URL)
            
            await new Promise((resolve, reject) => {
                ws.onopen = () => {
                    ws.send(JSON.stringify({
                        name,
                        amount,
                        message
                    }))
                    ws.close()
                    resolve(true)
                }
                
                ws.onerror = (error) => {
                    reject(error)
                }
            })
        } catch (wsError) {
            console.error('WebSocket error:', wsError)
            // Continue with the response even if WebSocket fails
        }

        return NextResponse.json({ success: true, data: result[0] })
    } catch (error) {
        console.error('Error processing TTS message:', error)
        return NextResponse.json(
            { error: 'Failed to process TTS message' },
            { status: 500 }
        )
    }
}
