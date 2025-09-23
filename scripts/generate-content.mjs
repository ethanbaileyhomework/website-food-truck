import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.join(rootDir, "content");
const outputDir = path.join(rootDir, "generated");

async function readFile(filePath) {
  return fs.readFile(filePath, "utf8");
}

async function readYaml(fileName) {
  const filePath = path.join(contentDir, fileName);
  const file = await readFile(filePath);
  return YAML.parse(file);
}

async function readMarkdown(fileName) {
  const filePath = path.join(contentDir, fileName);
  const file = await readFile(filePath);
  const { data, content } = matter(file);
  return {
    data,
    content: content.trim(),
  };
}

async function readMarkdownCollection(folder) {
  const dirPath = path.join(contentDir, folder);
  const entries = await fs.readdir(dirPath);
  const items = await Promise.all(
    entries
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.(md|mdx)$/i, "");
        const { data, content } = await readMarkdown(path.join(folder, fileName));
        return { slug, data, content };
      })
  );
  return items;
}

async function generate() {
  const [
    siteSettings,
    home,
    statsSettings,
    about,
    donate,
    volunteer,
    sponsors,
    legalPrivacy,
    legalTerms,
    team,
    stories,
    partners,
  ] = await Promise.all([
    readYaml("site-settings.yaml"),
    readYaml("home.yaml"),
    readYaml("stats-settings.yaml"),
    readYaml("about.yaml"),
    readYaml("donate.yaml"),
    readYaml("volunteer.yaml"),
    readYaml("sponsors.yaml"),
    readMarkdown(path.join("legal", "privacy.md")),
    readMarkdown(path.join("legal", "terms.md")),
    readMarkdownCollection("team"),
    readMarkdownCollection("stories"),
    readMarkdownCollection("partners"),
  ]);

  const output = {
    siteSettings,
    home,
    statsSettings,
    about,
    donate,
    volunteer,
    sponsors,
    legal: {
      privacy: { slug: "privacy", ...legalPrivacy },
      terms: { slug: "terms", ...legalTerms },
    },
    team,
    stories,
    partners,
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    path.join(outputDir, "content.json"),
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8"
  );
}

generate().catch((error) => {
  console.error("Failed to generate content", error);
  process.exitCode = 1;
});
