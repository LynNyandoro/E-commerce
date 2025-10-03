const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'public', 'env.template.js');
const publicEnvPath = path.join(__dirname, '..', 'public', 'env.js');
const buildEnvPath = path.join(__dirname, '..', 'build', 'env.js');

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateEnvJs() {
  const template = fs.readFileSync(templatePath, 'utf8');
  const apiUrl = process.env.REACT_APP_API_URL || '';
  const output = template.replace('${REACT_APP_API_URL}', apiUrl);

  ensureDirExists(publicEnvPath);
  fs.writeFileSync(publicEnvPath, output, 'utf8');

  // If build exists (postbuild), also write to build/env.js so it is served
  if (fs.existsSync(path.join(__dirname, '..', 'build'))) {
    ensureDirExists(buildEnvPath);
    fs.writeFileSync(buildEnvPath, output, 'utf8');
  }

  console.log('env.js generated with REACT_APP_API_URL =', apiUrl || '[empty]');
}

generateEnvJs();


