import { type NextRequest, NextResponse } from "next/server"

type RouteContext = {
  params: Promise<{
    owner: string
    repo: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { owner, repo } = await context.params
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const state = searchParams.get("state")

  if (!type || !state) {
    return NextResponse.json({ error: "Missing type or state parameter" }, { status: 400 })
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitHub-Tracker-App",
    }

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/${type}?state=${state}&per_page=50`

    const response = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("GitHub API error:", response.status, errorText)

      if (response.status === 404) {
        return NextResponse.json({ error: "Repository not found" }, { status: 404 })
      }
      if (response.status === 403) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 403 })
      }

      return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({error}, { status: 500 })
  }
}
