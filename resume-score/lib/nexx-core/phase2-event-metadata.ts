type ExtractedResume = Readonly<{
  fileType: "pdf" | "doc" | "docx" | "image";
  extractionMethod: "pdf-parse" | "docx-parser" | "ocr" | "mock";
}>;

function sizeBand(bytes: number): "under_1mb" | "1mb_to_4mb" | "4mb_to_10mb" {
  if (bytes < 1024 * 1024) return "under_1mb";
  if (bytes <= 4 * 1024 * 1024) return "1mb_to_4mb";
  return "4mb_to_10mb";
}

/** Returns the catalog's coarse, non-identifying upload metadata only. */
export function toNexxCoreUploadMetadata(file: ExtractedResume, bytes: number) {
  const extractionMethod = file.extractionMethod === "pdf-parse"
    ? "pdf_parse"
    : file.extractionMethod === "docx-parser"
      ? "docx_parser"
      : file.extractionMethod === "ocr"
        ? "ocr"
        : undefined;
  if (!extractionMethod) return undefined;
  return {
    fileFormat: file.fileType === "docx" ? "docx" : file.fileType,
    extractionMethod,
    sizeBand: sizeBand(bytes)
  } as const;
}
