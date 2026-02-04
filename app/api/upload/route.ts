import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase";
import { nanoid } from "nanoid";

/**
 * API Route Handler for Supabase Storage File Uploads
 * Uses the Supabase storage client directly
 */
export async function POST(request: NextRequest) {
  try {
    let file: Buffer | File;
    let fileName: string;
    let contentType: string;
    let folder: string = "uploads";

    const contentTypeHeader = request.headers.get("content-type") || "";

    try {
      // Try to handle FormData first
      if (contentTypeHeader.includes("multipart/form-data")) {
        const formData = await request.formData();
        const fileField = formData.get("file") as File;
        
        if (!fileField) {
          return NextResponse.json(
            { error: "Missing file in FormData" },
            { status: 400 }
          );
        }

        fileName = fileField.name || "file";
        contentType = fileField.type || "application/octet-stream";
        folder = (formData.get("folder") as string) || "uploads";
        file = fileField;
      } else {
        // Handle JSON with base64
        let body: any;
        try {
          body = await request.json();
        } catch (parseError) {
          return NextResponse.json(
            { error: "Invalid JSON body. Ensure the request is sending valid JSON." },
            { status: 400 }
          );
        }

        const { file: fileData, fileName: name, contentType: type, folder: fld } = body;
        
        if (!fileData || !name || !type) {
          return NextResponse.json(
            { error: "Missing required fields: file (base64 string), fileName, or contentType" },
            { status: 400 }
          );
        }

        fileName = name;
        contentType = type;
        folder = fld || "uploads";

        // Convert base64 string to Buffer
        try {
          file = Buffer.from(fileData, "base64");
          if ((file as Buffer).length === 0) {
            throw new Error("Base64 decoding resulted in empty buffer");
          }
        } catch (bufferError) {
          return NextResponse.json(
            { error: "Invalid base64 file data. Ensure file is properly base64 encoded." },
            { status: 400 }
          );
        }
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to parse request" },
        { status: 400 }
      );
    }

    // Generate unique file path
    const fileExt = fileName.split(".").pop();
    const uniqueFileName = `${nanoid()}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${uniqueFileName}`;
    const bucketName = "media";

    console.log("[Upload] File info:", {
      fileName,
      fileSize: file instanceof File ? file.size : (file as Buffer).length,
      contentType,
      filePath,
      bucketName,
    });

    // Upload to Supabase Storage
    console.log("[Upload] Uploading to Supabase Storage...");
    
    let uploadData;
    if (file instanceof File) {
      uploadData = await supabaseServiceRole.storage
        .from(bucketName)
        .upload(filePath, file, {
          contentType: contentType,
          upsert: false,
        });
    } else {
      uploadData = await supabaseServiceRole.storage
        .from(bucketName)
        .upload(filePath, file, {
          contentType: contentType,
          upsert: false,
        });
    }

    if (uploadData.error) {
      throw new Error(`Storage upload failed: ${uploadData.error.message}`);
    }

    console.log("[Upload] Supabase Storage upload successful");

    // Get the public URL
    const { data } = supabaseServiceRole.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    return NextResponse.json({
      url: publicUrl,
      path: filePath,
      id: filePath,
    });
  } catch (error: any) {
    console.error("[Upload Error]:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack?.substring(0, 500),
    });
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to upload file",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
