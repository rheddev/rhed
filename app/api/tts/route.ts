import { NextResponse } from 'next/server'

// TTS Server URL
const TTS_SERVER_URL = process.env.TTS_SERVER_URL || 'http://localhost:8080'

export async function POST(request: Request) {
    try {
        const { name, amount, message } = await request.json()

        if (!name || !amount || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Send to TTS Server WebSocket endpoint
        try {
            const response = await fetch(`${TTS_SERVER_URL}/ws/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    amount,
                    message
                })
            })

            if (!response.ok) {
                throw new Error(`Failed to send message to TTS server: ${response.statusText}`)
            }
        } catch (wsError) {
            console.error('Error sending message to TTS server:', wsError)
            return NextResponse.json(
                { error: 'Failed to send message to TTS server' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error processing TTS message:', error)
        return NextResponse.json(
            { error: 'Failed to process TTS message' },
            { status: 500 }
        )
    }
}
