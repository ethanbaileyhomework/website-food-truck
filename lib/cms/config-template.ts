import { loadStaticFile } from "@/lib/server/static-file";

export function loadConfigTemplate(): string {
  return loadStaticFile("admin/config.yml");
}
