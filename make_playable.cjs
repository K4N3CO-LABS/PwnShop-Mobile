const fs = require('fs');

console.log("Creating standalone HTML file...");
let html = fs.readFileSync('dist/index.html', 'utf-8');

// Remove crossorigin attribute which blocks file:// execution in some browsers
html = html.replace(/ crossorigin/g, '');

// Save as a playable local file
fs.writeFileSync('PwnShop_Playable.html', html);
console.log("Successfully created PwnShop_Playable.html! You can double click this file to play.");

