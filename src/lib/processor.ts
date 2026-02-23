import { PDFDocument, degrees } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { Job } from "./models";
import connectToDatabase from "./mongodb";
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
            const { rgb } = require("pdf-lib");
            const pdfDoc = await PDFDocument.load(inputBuffer);
            const pages = pdfDoc.getPages();

            const payload = job.payload || {};
            const type = payload.type || "text";
            const opacity = typeof payload.opacity !== 'undefined' ? parseFloat(payload.opacity) : 0.5;
            const rotationAngle = parseInt(payload.rotation) || 0;
            const posX = parseFloat(payload.positionX) || 50;
            const posY = parseFloat(payload.positionY) || 50;

            let imageEmbed = null;
            if (type === "image" && payload.additionalKeys && payload.additionalKeys.length > 0) {
                const imagePath = path.join(uploadDir, payload.additionalKeys[0]);
                const imageBuffer = await fs.readFile(imagePath);
                try {
                    imageEmbed = await pdfDoc.embedPng(imageBuffer);
                } catch {
                    try {
                        imageEmbed = await pdfDoc.embedJpg(imageBuffer);
                    } catch (e) {
                        console.error("Failed to embed image:", e);
                    }
                }
            }

            pages.forEach((page, index) => {
                const { width, height } = page.getSize();

                const pageConfig = (payload.positions && payload.positions[index]) || {};
                const pagePosX = typeof pageConfig.positionX !== 'undefined' ? parseFloat(pageConfig.positionX) : posX;
                const pagePosY = typeof pageConfig.positionY !== 'undefined' ? parseFloat(pageConfig.positionY) : posY;

                const x = (pagePosX / 100) * width;
                const y = ((100 - pagePosY) / 100) * height; // Inverting Y because PDF 0,0 is bottom-left

                if (type === "text" || !imageEmbed) {
                    const textStr = payload.text || "PDFY AI";
                    const size = parseInt(payload.fontSize) || 40;

                    let colorRgb = rgb(0, 0, 0);
                    if (payload.color) {
                        const hex = payload.color.replace(/^#/, '');
                        if (hex.length === 6) {
                            colorRgb = rgb(
                                parseInt(hex.substring(0, 2), 16) / 255,
                                parseInt(hex.substring(2, 4), 16) / 255,
                                parseInt(hex.substring(4, 6), 16) / 255
                            );
                        }
                    }

                    page.drawText(textStr, {
                        x, y,
                        size,
                        opacity,
                        color: colorRgb,
                        rotate: degrees(-rotationAngle) // matching web css rotation visually
                    });
                } else if (imageEmbed) {
                    const fontSizeValue = parseInt(payload.fontSize) || 40;
                    const stampWidth = (width * 0.4) * (fontSizeValue / 40);
                    const scaleObj = imageEmbed.scaleToFit(stampWidth, stampWidth);
                    page.drawImage(imageEmbed, {
                        x, y,
                        width: scaleObj.width,
                        height: scaleObj.height,
                        opacity,
                        rotate: degrees(-rotationAngle)
                    });
                }
            });
            outputBuffer = Buffer.from(await pdfDoc.save());
        } else if (job.type === "SPLIT") {
            const pdfDoc = await PDFDocument.load(inputBuffer);
            const splitPdf = await PDFDocument.create();
            const [firstPage] = await splitPdf.copyPages(pdfDoc, [0]);
            splitPdf.addPage(firstPage);
            outputBuffer = Buffer.from(await splitPdf.save());
        } else if (job.type === "PROTECT") {
            const { Recipe } = require("muhammara");
            const tempOutputPath = path.join(uploadDir, `temp-${jobId}.pdf`);
            const recipe = new Recipe(inputPath, tempOutputPath);
            recipe.encrypt({
                userPassword: job.payload?.password,
                ownerPassword: job.payload?.password,
                userProtectionFlag: 4
            });
            recipe.endPDF();
            outputBuffer = await fs.readFile(tempOutputPath);
            await fs.unlink(tempOutputPath).catch(() => { });
        } else if (job.type === "UNLOCK") {
            const muhammara = require("muhammara");
            const tempOutputPath = path.join(uploadDir, `temp-${jobId}.pdf`);
            try {
                muhammara.recrypt(inputPath, tempOutputPath, { password: job.payload?.password || "" });
                outputBuffer = await fs.readFile(tempOutputPath);
                await fs.unlink(tempOutputPath).catch(() => { });
            } catch (err: any) {
                throw new Error("Failed to unlock PDF. Please ensure the password is correct.");
            }
        } else if (job.type === "PDF_TO_WORD") {
            const PDFParser = require("pdf2json");
            const dataText = await new Promise<string>((resolve, reject) => {
                const pdfParser = new PDFParser(null, 1);
                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", () => {
                    resolve(pdfParser.getRawTextContent().replace(/\r\n/g, " \n"));
                });
                pdfParser.parseBuffer(inputBuffer);
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: dataText.split("\n").map((line: string) =>
                        new Paragraph({
                            children: [new TextRun(line.trim())],
                        })
                    ),
                }],
            });
            outputBuffer = await Packer.toBuffer(doc);
        } else if (job.type === "WORD_TO_PDF") {
            const mammoth = require("mammoth");
            const result = await mammoth.extractRawText({ buffer: inputBuffer });
            const text = result.value;

            const pdfDoc = await PDFDocument.create();
            let page = pdfDoc.addPage();
            const { height } = page.getSize();
            const fontSize = 12;
            const margin = 50;
            let y = height - margin;

            const lines = text.split('\n');
            for (const line of lines) {
                const maxChars = 90;
                let currentLine = line;
                while (currentLine.length > 0 || currentLine === line) {
                    let chunk = currentLine.substring(0, maxChars);
                    currentLine = currentLine.substring(maxChars);

                    if (y < margin) {
                        page = pdfDoc.addPage();
                        y = height - margin;
                    }
                    if (chunk.trim() !== "" || currentLine === line) {
                        page.drawText(chunk, {
                            x: margin,
                            y: y,
                            size: fontSize,
                        });
                        y -= (fontSize + 5);
                    }
                    if (currentLine === line) break; // if empty line
                }
            }
            outputBuffer = Buffer.from(await pdfDoc.save());
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
