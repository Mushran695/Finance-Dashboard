#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function scan(dir, depth) {
  if (depth < 0) return [];
  let res = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      try {
        if (fs.statSync(p).isDirectory()) {
          res.push(p);
          res = res.concat(scan(p, depth - 1));
        }
      } catch (e) {}
    }
  } catch (e) {}
  return res;
}

const dirs = scan('.', 2);
let ran = false;
for (const d of dirs) {
  const pj = path.join(d, 'package.json');
  if (fs.existsSync(pj)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pj));
      if (pkg.scripts && pkg.scripts.dev) {
        ran = true;
        console.log('Running dev in', d);
        const r = spawnSync('npm', ['-w', d, 'run', 'dev'], { stdio: 'inherit' });
        if (r.status !== 0) process.exit(r.status);
      }
    } catch (e) {}
  }
}

if (!ran) {
  console.log('No workspace with dev script found.');
  process.exit(0);
}
