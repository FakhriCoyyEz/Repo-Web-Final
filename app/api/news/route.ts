import { auth } from "@/lib/auth";
import { NewsService } from "@/lib/services/app-service";
import { NextRequest, NextResponse } from "next/server";
import { Navbar } from '@/components/navbar'

export async function GET() {
  const news = await NewsService.getAll();
  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const result = await NewsService.create({
    ...data,
    authorId: session.user.id,
  });

  return NextResponse.json(result);
}
