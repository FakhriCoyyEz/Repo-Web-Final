import { auth } from "@/lib/auth";
import { GlobalService } from "@/lib/services/app-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const settings = await GlobalService.getAll();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  
  // Save each key
  const promises = Object.entries(data).map(([key, value]) => 
    GlobalService.set(key, value as string)
  );
  
  await Promise.all(promises);

  return NextResponse.json({ success: true });
}
