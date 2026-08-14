const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('Content-Security-Policy')) {
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https: blob:; connect-src 'self' wss: https:;" />`;
  html = html.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    ' + csp);
  fs.writeFileSync('index.html', html);
}
