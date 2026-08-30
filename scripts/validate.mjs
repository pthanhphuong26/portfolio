import { access, readFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = resolve(projectRoot, process.argv[2] ?? '.');
const htmlPath = resolve(siteRoot, 'index.html');
const errors = [];

const report = (condition, message) => {
  if (!condition) errors.push(message);
};

const fileExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const html = await readFile(htmlPath, 'utf8');

report((html.match(/<h1\b/gi) ?? []).length === 1, 'index.html must contain exactly one <h1>.');
report(!/<style\b/i.test(html), 'Move inline CSS to assets/css/.');
report(!/<script\b(?![^>]*\bsrc=)[^>]*>/i.test(html), 'Move inline JavaScript to assets/js/.');

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
report(duplicateIds.length === 0, `Duplicate HTML ids: ${[...new Set(duplicateIds)].join(', ')}`);

for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
  report(/\balt=["'][^"']*["']/i.test(match[1]), `Image is missing alt text: ${match[0]}`);
}

for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
  const attributes = match[1];
  if (/\btarget=["']_blank["']/i.test(attributes)) {
    report(/\brel=["'][^"']*noopener[^"']*["']/i.test(attributes), `External link is missing rel="noopener": ${match[0]}`);
  }
}

const localReferences = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)]
  .map((match) => match[1])
  .filter((reference) => !/^(?:[a-z]+:|#|\/\/)/i.test(reference));

for (const reference of localReferences) {
  const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  const targetPath = isAbsolute(cleanReference)
    ? resolve(siteRoot, `.${cleanReference}`)
    : resolve(siteRoot, cleanReference);

  report(targetPath.startsWith(siteRoot), `Local reference leaves the site root: ${reference}`);
  report(await fileExists(targetPath), `Missing local file referenced by index.html: ${reference}`);
}

if (errors.length > 0) {
  console.error(`Site validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlPath}`);
}
