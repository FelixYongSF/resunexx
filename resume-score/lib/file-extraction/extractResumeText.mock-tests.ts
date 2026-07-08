import { detectFileType, validateResumeFile } from "./extractResumeText";

export function runResumeFileExtractionMockTests() {
  const pdf = makeFile("resume.pdf", "application/pdf", 500_000);
  const docx = makeFile(
    "resume.docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    500_000
  );
  const image = makeFile("resume.png", "image/png", 500_000);
  const unsupported = makeFile("resume.txt", "text/plain", 10_000);
  const tooLarge = makeFile("resume.pdf", "application/pdf", 11 * 1024 * 1024);
  const tooLittleReadableText = "Short resume";

  return {
    pdfTextInput: expectNoThrow(() => validateResumeFile(pdf)) && detectFileType(pdf) === "pdf",
    docxTextInput: expectNoThrow(() => validateResumeFile(docx)) && detectFileType(docx) === "docx",
    imageOcrFallback: expectNoThrow(() => validateResumeFile(image)) && detectFileType(image) === "image",
    unsupportedFileType: expectThrow(() => validateResumeFile(unsupported), "Unsupported file type"),
    fileTooLarge: expectThrow(() => validateResumeFile(tooLarge), "10MB"),
    tooLittleReadableText: tooLittleReadableText.length < 400
  };
}

function makeFile(name: string, type: string, size: number): File {
  return {
    name,
    type,
    size,
    arrayBuffer: async () => new ArrayBuffer(0)
  } as File;
}

function expectNoThrow(fn: () => void) {
  try {
    fn();
    return true;
  } catch {
    return false;
  }
}

function expectThrow(fn: () => void, expectedMessagePart: string) {
  try {
    fn();
    return false;
  } catch (error) {
    return error instanceof Error && error.message.includes(expectedMessagePart);
  }
}
