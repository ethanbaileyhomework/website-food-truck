import { readFileSync } from "node:fs";
import path from "node:path";

const fileCache = new Map<string, string>();
const errorCache = new Map<string, Error>();

export function loadStaticFile(relativePath: string): string {
  const absolutePath = path.resolve(process.cwd(), relativePath);

  if (!fileCache.has(absolutePath) && !errorCache.has(absolutePath)) {
    try {
      const content = readFileSync(absolutePath, "utf8");
      fileCache.set(absolutePath, content);
    } catch (error) {
      errorCache.set(
        absolutePath,
        error instanceof Error
          ? error
          : new Error(`Unknown error loading static file at ${relativePath}.`)
      );
    }
  }

  const cachedError = errorCache.get(absolutePath);
  if (cachedError) {
    throw cachedError;
  }

  const cachedContent = fileCache.get(absolutePath);
  if (typeof cachedContent !== "string") {
    throw new Error(`Static file at ${relativePath} is not available.`);
  }

  return cachedContent;
}
