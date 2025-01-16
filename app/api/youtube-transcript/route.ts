import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { message: 'Video ID manquant' },
        { status: 400 }
      );
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return NextResponse.json(transcript);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { message: 'Impossible de récupérer la transcription' },
      { status: 500 }
    );
  }
}
