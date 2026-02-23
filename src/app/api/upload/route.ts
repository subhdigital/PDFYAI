import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${uuidv4()}-${file.name}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            key: fileName,
            url: `/uploads/${fileName}`
        });
    } catch (error: any) {
        console.error("Local upload error:", error);
        return NextResponse.json({ error: "Failed to upload file locally" }, { status: 500 });
    }
}
