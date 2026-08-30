import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(projectRoot, 'dist');

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(join(projectRoot, 'index.html'), join(outputDirectory, 'index.html'));
await cp(join(projectRoot, 'assets'), join(outputDirectory, 'assets'), { recursive: true });
await writeFile(join(outputDirectory, '.nojekyll'), '');

console.log(`Built static site in ${outputDirectory}`);
