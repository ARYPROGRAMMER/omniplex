import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // Ensure to set this in your environment variables.
const URL_SHORTEN_API_URL = "https://url-shortener-and-unshortener.p.rapidapi.com/v1/shorten";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const originalUrl = searchParams.get("url");
  const customAlias = searchParams.get("alias");

  if (!originalUrl || typeof originalUrl !== "string") {
    return new NextResponse(
      JSON.stringify({
        message: 'Query parameter "url" is required and must be a string.',
      }),
      { status: 400 }
    );
  }

  if (!RAPIDAPI_KEY) {
    console.error("RapidAPI key is undefined. Please check your environment variables.");
    return new NextResponse(
      JSON.stringify({ message: "RapidAPI key is not configured." }),
      { status: 500 }
    );
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": "url-shortener-and-unshortener.p.rapidapi.com",
    };

    const body = JSON.stringify({
      url: originalUrl,
      alias: customAlias || undefined, // Only include alias if provided
    });

    const apiResponse = await fetch(URL_SHORTEN_API_URL, {
      method: "POST",
      headers,
      body,
    });

    if (!apiResponse.ok) {
      throw new Error(
        `URL Shortener API request failed with status ${apiResponse.status}`
      );
    }

    const data = await apiResponse.json();

    return NextResponse.json({
      originalUrl,
      shortenedUrl: data.result_url || "No shortened URL returned.",
      alias: data.alias || "No alias provided.",
    });
  } catch (error) {
    console.error("API request error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
