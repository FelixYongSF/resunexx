import { readFileSync } from "node:fs";
import { join } from "node:path";

export type RobotoWeight = "regular" | "medium" | "bold";

type FontTable = { offset: number; length: number };

export type EmbeddedRobotoFont = {
  weight: RobotoWeight;
  postscriptName: string;
  data: Buffer;
  unitsPerEm: number;
  ascent: number;
  descent: number;
  bbox: [number, number, number, number];
  glyphs: Map<number, number>;
  widths: Map<number, number>;
};

const sourceFiles: Record<RobotoWeight, string> = {
  regular: "Roboto-Regular.ttf",
  medium: "Roboto-Medium.ttf",
  bold: "Roboto-Bold.ttf"
};

const postscriptNames: Record<RobotoWeight, string> = {
  regular: "Roboto-Regular",
  medium: "Roboto-Medium",
  bold: "Roboto-Bold"
};

let cachedFonts: Record<RobotoWeight, EmbeddedRobotoFont> | undefined;

export function getRobotoFonts() {
  if (cachedFonts) return cachedFonts;

  cachedFonts = (Object.keys(sourceFiles) as RobotoWeight[]).reduce((fonts, weight) => {
    const data = readFileSync(join(process.cwd(), "assets", "fonts", sourceFiles[weight]));
    fonts[weight] = parseRobotoFont(data, weight, postscriptNames[weight]);
    return fonts;
  }, {} as Record<RobotoWeight, EmbeddedRobotoFont>);

  return cachedFonts;
}

function parseRobotoFont(data: Buffer, weight: RobotoWeight, postscriptName: string): EmbeddedRobotoFont {
  const tables = readTables(data);
  const head = requireTable(data, tables, "head");
  const hhea = requireTable(data, tables, "hhea");
  const hmtx = requireTable(data, tables, "hmtx");
  const cmap = requireTable(data, tables, "cmap");

  const unitsPerEm = data.readUInt16BE(head.offset + 18);
  const bbox: [number, number, number, number] = [
    data.readInt16BE(head.offset + 36),
    data.readInt16BE(head.offset + 38),
    data.readInt16BE(head.offset + 40),
    data.readInt16BE(head.offset + 42)
  ];
  const ascent = data.readInt16BE(hhea.offset + 4);
  const descent = data.readInt16BE(hhea.offset + 6);
  const numberOfHMetrics = data.readUInt16BE(hhea.offset + 34);
  const glyphs = readFormat4Cmap(data, cmap);
  const widths = new Map<number, number>();

  for (const glyphId of new Set(glyphs.values())) {
    const metricIndex = Math.min(glyphId, numberOfHMetrics - 1);
    const advanceWidth = data.readUInt16BE(hmtx.offset + metricIndex * 4);
    widths.set(glyphId, (advanceWidth / unitsPerEm) * 1000);
  }

  return { weight, postscriptName, data, unitsPerEm, ascent, descent, bbox, glyphs, widths };
}

function readTables(data: Buffer) {
  const tableCount = data.readUInt16BE(4);
  const tables = new Map<string, FontTable>();
  for (let index = 0; index < tableCount; index += 1) {
    const offset = 12 + index * 16;
    tables.set(data.toString("ascii", offset, offset + 4), {
      offset: data.readUInt32BE(offset + 8),
      length: data.readUInt32BE(offset + 12)
    });
  }
  return tables;
}

function requireTable(data: Buffer, tables: Map<string, FontTable>, tag: string) {
  const table = tables.get(tag);
  if (!table || table.offset + table.length > data.length) throw new Error(`Roboto font table ${tag} is unavailable.`);
  return table;
}

function readFormat4Cmap(data: Buffer, table: FontTable) {
  const recordCount = data.readUInt16BE(table.offset + 2);
  let chosenOffset: number | undefined;

  for (let index = 0; index < recordCount; index += 1) {
    const record = table.offset + 4 + index * 8;
    const platformId = data.readUInt16BE(record);
    const encodingId = data.readUInt16BE(record + 2);
    const subtableOffset = table.offset + data.readUInt32BE(record + 4);
    if (subtableOffset >= data.length || data.readUInt16BE(subtableOffset) !== 4) continue;
    if (platformId === 3 && (encodingId === 1 || encodingId === 0)) {
      chosenOffset = subtableOffset;
      break;
    }
    chosenOffset ??= subtableOffset;
  }

  if (chosenOffset === undefined) throw new Error("Roboto font does not include a supported Unicode cmap.");
  const segmentCount = data.readUInt16BE(chosenOffset + 6) / 2;
  const endCodes = chosenOffset + 14;
  const startCodes = endCodes + segmentCount * 2 + 2;
  const deltas = startCodes + segmentCount * 2;
  const rangeOffsets = deltas + segmentCount * 2;
  const glyphs = new Map<number, number>();

  for (let codePoint = 0x20; codePoint <= 0x7e; codePoint += 1) {
    for (let segment = 0; segment < segmentCount; segment += 1) {
      const end = data.readUInt16BE(endCodes + segment * 2);
      const start = data.readUInt16BE(startCodes + segment * 2);
      if (codePoint < start || codePoint > end) continue;
      const delta = data.readInt16BE(deltas + segment * 2);
      const rangeOffsetAddress = rangeOffsets + segment * 2;
      const rangeOffset = data.readUInt16BE(rangeOffsetAddress);
      let glyphId: number;
      if (rangeOffset === 0) {
        glyphId = (codePoint + delta) & 0xffff;
      } else {
        const glyphAddress = rangeOffsetAddress + rangeOffset + (codePoint - start) * 2;
        glyphId = data.readUInt16BE(glyphAddress);
        if (glyphId !== 0) glyphId = (glyphId + delta) & 0xffff;
      }
      glyphs.set(codePoint, glyphId);
      break;
    }
  }

  if (!glyphs.has(0x20) || !glyphs.has(0x41)) throw new Error("Roboto font character map is incomplete.");
  return glyphs;
}
