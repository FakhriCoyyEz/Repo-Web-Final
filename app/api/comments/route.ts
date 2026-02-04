import { CommentService } from "@/lib/services/app-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get("targetId");
  const type = searchParams.get("type") as 'news' | 'gallery';

  if (!targetId || !type) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const items = await CommentService.getByPost(targetId, type);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await CommentService.create(data);
  return NextResponse.json(result);
}
