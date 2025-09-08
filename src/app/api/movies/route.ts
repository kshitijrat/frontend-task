import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'TMDB_API_KEY missing' }, { status: 500 })
  }
  

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000) // 15 sec timeout

    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
      { cache: 'no-store', signal: controller.signal }
    )

    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'TMDB API error', details: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ results: data.results })
  } catch (err) {
    const message = typeof err === 'object' && err !== null && 'message' in err
      ? (err as { message?: string }).message
      : String(err);
    return NextResponse.json({ error: 'Network error', message }, { status: 500 })
  }
}
