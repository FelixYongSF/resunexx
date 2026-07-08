import { inflateRawSync } from "node:zlib";

export async function extractDocText(buffer: Buffer, fileType: "doc" | "docx") {
  if (fileType === "doc") {
    throw new Error("Please export your resume as PDF or DOCX for best results.");
  }

  const documentXml = extractDocxEntry(buffer, "word/document.xml");
  if (!documentXml) {
    throw new Error("We could not read this DOCX file. Please export your resume as PDF or DOCX and try again.");
  }

  return {
    text: cleanDocxText(documentXml),
    extractionMethod: "docx-parser" as const,
    warnings: []
  };
}

function extractDocxEntry(buffer: Buffer, entryName: string) {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  if (eocdOffset < 0) return "";

  const centralDirectorySize = buffer.readUInt32LE(eocdOffset + 12);
  const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
  let offset = centralDirectoryOffset;
  const end = centralDirectoryOffset + centralDirectorySize;

  while (offset < end && buffer.readUInt32LE(offset) === 0x02014b50) {
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const fileName = buffer.toString("utf8", offset + 46, offset + 46 + fileNameLength);

    if (fileName === entryName) {
      return readLocalFile(buffer, localHeaderOffset, compressedSize, compressionMethod);
    }

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return "";
}

function readLocalFile(buffer: Buffer, offset: number, compressedSize: number, compressionMethod: number) {
  if (buffer.readUInt32LE(offset) !== 0x04034b50) return "";

  const fileNameLength = buffer.readUInt16LE(offset + 26);
  const extraLength = buffer.readUInt16LE(offset + 28);
  const dataStart = offset + 30 + fileNameLength + extraLength;
  const compressed = buffer.subarray(dataStart, dataStart + compressedSize);

  if (compressionMethod === 0) return compressed.toString("utf8");
  if (compressionMethod === 8) return inflateRawSync(compressed).toString("utf8");
  return "";
}

function findEndOfCentralDirectory(buffer: Buffer) {
  const min = Math.max(0, buffer.length - 65557);
  for (let index = buffer.length - 22; index >= min; index -= 1) {
    if (buffer.readUInt32LE(index) === 0x06054b50) return index;
  }
  return -1;
}

function cleanDocxText(xml: string) {
  return xml
    .replace(/<w:tab\/>/g, " ")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
