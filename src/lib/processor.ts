import { PDFDocument, degrees } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { Job } from "./models";
import connectToDatabase from "./mongodb";
// @ts-ignore
const pdfParse = require("pdf-parse");
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function processJobLocally(jobId: string) {
    await connectToDatabase();
    const job = await Job.findById(jobId);
    if (!job) return;

    try {
        await Job.findByIdAndUpdate(jobId, { status: "PROCESSING" });

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const inputPath = path.join(uploadDir, job.inputKey!);
        const inputBuffer = await fs.readFile(inputPath);

        let outputBuffer: Buffer;

        if (job.type === "MERGE") {
            const mergedPdf = await PDFDocument.create();
            const firstPdf = await PDFDocument.load(inputBuffer);
            const copiedPages = await mergedPdf.copyPages(firstPdf, firstPdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));

            if (job.payload?.additionalKeys) {
                for (const key of job.payload.additionalKeys) {
                    const extraPath = path.join(uploadDir, key);
                    const extraBuffer = await fs.readFile(extraPath);
                    const extraPdf = await PDFDocument.load(extraBuffer);
                    const extraPages = await mergedPdf.copyPages(extraPdf, extraPdf.getPageIndices());
                    extraPages.forEach((page) => mergedPdf.addPage(page));
                }
            }
            outputBuffer = Buffer.from(await mergedPdf.save());
        } else if (job.type === "ROTATE") {
            const pdfDoc = await PDFDocument.load(inputBuffer);
            const pages = pdfDoc.getPages();
            pages.forEach(page => page.setRotation(degrees(page.getRotation().angle + 90)));
            outputBuffer = Buffer.from(await pdfDoc.save());
        } else if (job.type === "WATERMARK") {
            const pdfDoc = await PDFDocument.load(inputBuffer);
            const pages = pdfDoc.getPages();
            pages.forEach(page => {
                page.drawText(job.payload?.text || "PDFY AI", { x: 50, y: 50, size: 30, opacity: 0.5 });
            });
            outputBuffer = Buffer.from(await pdfDoc.save());
        } else if (job.type === "SPLIT") {
            const pdfDoc = await PDFDocument.load(inputBuffer);
            const splitPdf = await PDFDocument.create();
            const [firstPage] = await splitPdf.copyPages(pdfDoc, [0]);
            splitPdf.addPage(firstPage);
            outputBuffer = Buffer.from(await splitPdf.save());
        } else if (job.type === "PDF_TO_WORD") {
            const data = await pdfParse(inputBuffer);
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: data.text.split("\n").map((line: string) =>
                        new Paragraph({
                            children: [new TextRun(line)],
                        })
                    ),
                }],
            });
            outputBuffer = await Packer.toBuffer(doc);
        } else {
            // Placeholder for other tools
            outputBuffer = inputBuffer;
        }

        const extension = job.type === "PDF_TO_WORD" ? "docx" : "pdf";
        const outputFileName = `result-${jobId}.${extension}`;
        const outputPath = path.join(uploadDir, outputFileName);
        await fs.writeFile(outputPath, outputBuffer);

        await Job.findByIdAndUpdate(jobId, {
            status: "COMPLETED",
            outputKey: outputFileName,
            processedAt: new Date(),
        });

    } catch (error: any) {
        console.error(`Local processing error for job ${jobId}:`, error);
        await Job.findByIdAndUpdate(jobId, {
            status: "FAILED",
            error: error.message,
        });
    }
}
