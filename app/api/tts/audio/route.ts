import { HumeClient } from "hume";
import { NextResponse } from "next/server";

const hume = new HumeClient({
  apiKey: process.env.HUME_API_KEY!,
});

export async function POST(request: Request) {
    const { message, description } = await request.json();

    const speech = await hume.tts.synthesizeJson({
        utterances: [
            {
                description: description,
                text: message,
            },
        ],
    });

    const audio = speech.generations[0].audio;

    return NextResponse.json({ audio });
}