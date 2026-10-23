import fs from 'node:fs';

const file = process.argv[2];
const css = fs.readFileSync(file, 'utf8');
const targets = ['html', 'body', '.page-wrapper', '.main-wrapper'];

for (const target of targets) {
  const re = new RegExp(`(?:^|\\})\\s*${target.replace('.', '\\.')}(?:\\s*,[^{]*)?\\s*\\{([^}]*)\\}`, 'g');
  let m;
  let count = 0;
  while ((m = re.exec(css))) {
    console.log(`=== ${target} (${++count})`);
    console.log(m[1].trim());
  }
}

for (const m of css.matchAll(/body\s*>\s*[^{]+\{[^}]*\}/g)) {
  console.log('=== direct body child');
  console.log(m[0]);
}
