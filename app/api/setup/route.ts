import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const usersToCreate = [
      { email: "TestbuatmasNadhif", password: "WEAREICTEAM", name: "Admin ICT", role: "admin" },
    ];

    const results = [];
    for (const u of usersToCreate) {
      // Check if user exists
      const existing = await db.query.user.findFirst({
        where: eq(user.email, u.email),
      });

      if (!existing) {
        try {
          // Use Better Auth API to create user (handles password hashing)
          const result = await auth.api.signUpEmail({
            body: {
              email: u.email,
              password: u.password,
              name: u.name,
            },
          });

          if (result && result.user) {
            // Manually set role since signUpEmail doesn't take role in body by default
            await db.update(user)
              .set({ role: u.role })
              .where(eq(user.id, result.user.id));
            
            results.push({ email: u.email, status: "created", role: u.role });
          }
        } catch (e: any) {
          results.push({ email: u.email, status: "error", error: e.message });
        }
      } else {
        // If exists, ensure role is correct
        await db.update(user)
          .set({ role: u.role })
          .where(eq(user.id, existing.id));
        results.push({ email: u.email, status: "already_exists_updated_role" });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database initialized.", 
      results 
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
