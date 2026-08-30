const fs = require('fs');
const text = fs.readFileSync('src/routeTree.gen.ts', 'utf8');
console.log('has role-dashboard marker:', text.includes("'/role-dashboard'"));
console.log('has route import:', text.includes('role-dashboard'));
