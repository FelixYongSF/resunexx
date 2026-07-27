import assert from "node:assert/strict";
import test from "node:test";
import { toNexxCoreUploadMetadata } from "../lib/nexx-core/phase2-event-metadata.ts";

test("Phase 2 upload metadata is coarse and excludes file names or content", () => {
  assert.deepEqual(
    toNexxCoreUploadMetadata({ fileType: "pdf", extractionMethod: "pdf-parse" }, 250_000),
    { fileFormat: "pdf", extractionMethod: "pdf_parse", sizeBand: "under_1mb" }
  );
  assert.deepEqual(
    toNexxCoreUploadMetadata({ fileType: "docx", extractionMethod: "docx-parser" }, 2 * 1024 * 1024),
    { fileFormat: "docx", extractionMethod: "docx_parser", sizeBand: "1mb_to_4mb" }
  );
  assert.equal(toNexxCoreUploadMetadata({ fileType: "image", extractionMethod: "mock" }, 3 * 1024 * 1024), undefined);
});
