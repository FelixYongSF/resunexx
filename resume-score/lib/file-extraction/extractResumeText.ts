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

const maxUploadSize = 4 * 1024 * 1024;

const allowedMimeTypesByExtension: Record<string, Set<string>> = {
  ".pdf": new Set(["application/pdf"]),
  ".doc": new Set(["application/msword"]),
  ".docx": new Set(["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),
  ".jpg": new Set(["image/jpeg"]),
  ".jpeg": new Set(["image/jpeg"]),
  ".png": new Set(["image/png"])
};

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
    throw new Error("Please upload a resume file smaller than 4MB.");
  }

  const extension = getFileExtension(file.name);
  const allowedMimeTypes = allowedMimeTypesByExtension[extension];
  if (!allowedMimeTypes?.has(file.type)) {
    throw new Error("Unsupported file type. Only PDF and DOCX resumes can currently be analyzed.");
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
  const text = result.text
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

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
