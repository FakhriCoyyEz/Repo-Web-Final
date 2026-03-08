// app/api/news/programming/route.ts
// API untuk fetch news dari database Supabase dengan filter division='programming'

import { newsDb } from "@/server/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Query dari database news (Supabase) 
    // Filter hanya news dengan division = 'programming'
    const programmingNews = await newsDb.query.news.findMany({
      where: eq(news.division, 'programming'),
      orderBy: (news) => news.createdAt,
      limit: 20,
    });

    return NextResponse.json(programmingNews);
  } catch (error) {
    console.error("Programming News Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch programming news" },
      { status: 500 }
    );
  }
}
