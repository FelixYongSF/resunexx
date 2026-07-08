import { inflateSync } from "node:zlib";
import pdf from "pdf-parse";

export type PdfTextResult = {
  text: string;
  pages?: number;
  parser: "pdf-parse" | "best-effort";
};

export async function extractPdfText(buffer: Buffer): Promise<PdfTextResult> {
  try {
    const parsed = await pdf(buffer);
    return {
      text: cleanText(parsed.text),
      pages: parsed.numpages,
      parser: "pdf-parse"
    };
  } catch (error) {
    const text = cleanText(extractBestEffortPdfText(buffer));

    if (text.length >= 400) {
      console.warn("[pdf-text] pdf-parse failed. Using best-effort text extraction.", {
        error: error instanceof Error ? error.message : "Unknown PDF parse error"
      });

      return {
        text,
        parser: "best-effort"
      };
    }

    throw error;
  }
}

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function extractBestEffortPdfText(buffer: Buffer) {
  const source = buffer.toString("latin1");
  const chunks = extractPdfStreams(source)
    .map((stream) => decodeStream(stream))
    .join("\n");

  return [
    ...extractLiteralStrings(chunks),
    ...extractHexStrings(chunks)
  ].join(" ");
}

function extractPdfStreams(source: string) {
  const streams: string[] = [];
  const pattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source))) {
    streams.push(match[1]);
  }

  return streams;
}

function decodeStream(stream: string) {
  const bytes = Buffer.from(stream, "latin1");

  try {
    return inflateSync(bytes).toString("latin1");
  } catch {
    return stream;
  }
}

function extractLiteralStrings(content: string) {
  const values: string[] = [];
  const pattern = /\(([^()]*(?:\\.[^()]*)*)\)\s*(?:Tj|'|"|TJ)?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content))) {
    const value = decodePdfLiteralString(match[1]);
    if (isLikelyHumanText(value)) values.push(value);
  }

  return values;
}

function extractHexStrings(content: string) {
  const values: string[] = [];
  const pattern = /<([0-9A-Fa-f\s]{6,})>\s*(?:Tj|'|"|TJ)?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content))) {
    const compact = match[1].replace(/\s+/g, "");
    const value = decodeUtf16Be(Buffer.from(compact, "hex"));
    if (isLikelyHumanText(value)) values.push(value);
  }

  return values;
}

function decodePdfLiteralString(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

function isLikelyHumanText(value: string) {
  const trimmed = value.trim();
  if (trimmed.length < 2) return false;

  return /[A-Za-z0-9]/.test(trimmed);
}

function decodeUtf16Be(bytes: Buffer) {
  if (bytes.length < 2) return "";

  let output = "";
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    output += String.fromCharCode((bytes[index] << 8) | bytes[index + 1]);
  }

  return output;
}
