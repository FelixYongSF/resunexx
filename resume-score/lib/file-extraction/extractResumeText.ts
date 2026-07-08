import { extractDocText } from "./extractDocText";
import { extractImageText } from "./extractImageText";
import { extractPdfText } from "./extractPdfText";

export type ResumeFileType = "pdf" | "doc" | "docx" | "image";
export type ResumeExtractionMethod = "pdf-parse" | "docx-parser" | "ocr";

export type ResumeTextExtractionResult = {
  text: string;
  fileType: ResumeFileType;
  extractionMethod: ResumeExtractionMethod;
  warnings: string[];
};

const maxUploadSize = 10 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png"
]);

const allowedExtensions = new Set([".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]);

export async function extractResumeText(file: File): Promise<ResumeTextExtractionResult> {
  validateResumeFile(file);
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = detectFileType(file);

  try {
    if (fileType === "pdf") {
      const result = await extractPdfText(buffer);
      return ensureReadableText({ fileType, ...result });
    }

    if (fileType === "doc" || fileType === "docx") {
      const result = await extractDocText(buffer, fileType);
      return ensureReadableText({ fileType, ...result });
    }

    return await extractImageText();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Text extraction failed.";
    throw new Error(message);
  }
}

export function validateResumeFile(file: File) {
  if (file.size > maxUploadSize) {
    throw new Error("Please upload a resume file smaller than 10MB.");
  }

  const extension = getFileExtension(file.name);
  if (!allowedExtensions.has(extension) || !allowedMimeTypes.has(file.type)) {
    throw new Error("Unsupported file type. Please upload a PDF, DOCX, DOC, JPG, JPEG, or PNG resume.");
  }
}

export function detectFileType(file: File): ResumeFileType {
  const extension = getFileExtension(file.name);

  if (extension === ".pdf") return "pdf";
  if (extension === ".doc") return "doc";
  if (extension === ".docx") return "docx";
  return "image";
}

function ensureReadableText(result: ResumeTextExtractionResult): ResumeTextExtractionResult {
  const text = result.text.replace(/\s+/g, " ").trim();

  if (text.length < 400) {
    throw new Error(
      "This document contains too little readable text. Please upload a text-based PDF or DOCX resume for best results."
    );
  }

  return { ...result, text };
}

function getFileExtension(fileName: string) {
  const index = fileName.lastIndexOf(".");
  return index >= 0 ? fileName.slice(index).toLowerCase() : "";
}
