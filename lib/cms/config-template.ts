// @ts-expect-error -- YAML string import handled by webpack asset loader
import cmsConfigTemplate from "@/admin/config.yml";

export function loadConfigTemplate(): string {
  return cmsConfigTemplate;
}
