const { parse } = require("yaml");

module.exports = function yamlToJsonLoader(source) {
  this.cacheable?.();

  let parsed;
  try {
    parsed = parse(source.toString());
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to parse YAML configuration.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("YAML configuration must evaluate to an object.");
  }

  return `export default ${JSON.stringify(parsed)};`;
};
