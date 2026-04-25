import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cache = {};

function compileTemplate(templateName, data) {
  if (!cache[templateName]) {
    const filePath = path.join(
      __dirname,
      '..',
      'templates',
      `${templateName}.hbs`
    );
    const source = fs.readFileSync(filePath, 'utf-8');
    cache[templateName] = Handlebars.compile(source);
  }

  return cache[templateName](data);
}

export { compileTemplate };
