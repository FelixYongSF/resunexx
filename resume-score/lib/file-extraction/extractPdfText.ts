import { extractPdfText as extractPdfTextFromBuffer } from "@/lib/pdf-text";

export async function extractPdfText(buffer: Buffer) {
  const result = await extractPdfTextFromBuffer(buffer);
  return {
    text: result.text,
    extractionMethod: "pdf-parse" as const,
    warnings: result.parser === "best-effort" ? ["PDF parser used best-effort text extraction."] : []
  };
}
