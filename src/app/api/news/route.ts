import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'general'

  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'NEWS_API_KEY missing' }, { status: 500 })
  }

  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`

  const res = await fetch(url, { cache: 'no-store' })
  const data = await res.json()

  return NextResponse.json({ articles: data.articles })
}
