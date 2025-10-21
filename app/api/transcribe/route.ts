import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    return NextResponse.json(transcription, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
