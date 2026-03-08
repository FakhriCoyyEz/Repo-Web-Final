// app/api/news/route-supabase-example.ts
// Menggunakan DATABASE 2: SUPABASE (News Programming Database)

import { newsDb } from "@/server/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Query dari database news (Supabase)
    const newsList = await newsDb.query.news.findMany({
      limit: 20,
    });
    
    return NextResponse.json(newsList);
  } catch (error) {
    console.error("News Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Insert ke database news (Supabase)
    const result = await newsDb.insert(news).values({
      ...data,
      authorId: session.user.id,
    }).returning();

    return NextResponse.json(result);
  } catch (error) {
    console.error("News Error:", error);
    return NextResponse.json(
      { error: "Failed to save news" },
      { status: 500 }
    );
  }
}
