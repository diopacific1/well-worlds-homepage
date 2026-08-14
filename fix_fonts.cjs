const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Hanken\+Grotesk:wght@400;500;600;700&display=swap'\);\n/g, '');
css = css.replace(/@import url\('https:\/\/cdn\.jsdelivr\.net\/npm\/geist@1\.0\.3\/dist\/fonts\/geist-sans\/style\.css'\);\n/g, '');
css = css.replace(/@import url\('https:\/\/cdn\.jsdelivr\.net\/npm\/geist@1\.0\.3\/dist\/fonts\/geist-mono\/style\.css'\);\n/g, '');
css = css.replace(/@import url\('https:\/\/cdn\.jsdelivr\.net\/gh\/orioncactus\/pretendard\/dist\/web\/static\/pretendard\.css'\);\n/g, '');
fs.writeFileSync('src/index.css', css);

let html = fs.readFileSync('index.html', 'utf8');
const links = `
    <link rel="preload" as="style" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" /></noscript>

    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" /></noscript>

    <link rel="preload" as="style" href="https://cdn.jsdelivr.net/npm/geist@1.0.3/dist/fonts/geist-sans/style.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.3/dist/fonts/geist-sans/style.css" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.3/dist/fonts/geist-sans/style.css" /></noscript>

    <link rel="preload" as="style" href="https://cdn.jsdelivr.net/npm/geist@1.0.3/dist/fonts/geist-mono/style.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.3/dist/fonts/geist-mono/style.css" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.0.3/dist/fonts/geist-mono/style.css" /></noscript>
`;
html = html.replace(/<link rel="preconnect" href="https:\/\/cdn\.jsdelivr\.net" crossorigin \/>/, '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />' + links);
fs.writeFileSync('index.html', html);

