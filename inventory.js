const fs = require('fs');
const path = require('path');
const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir).filter(p => fs.statSync(path.join(packagesDir, p)).isDirectory());

const inventory = {};
for (const pkg of packages) {
  const pjsonPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pjsonPath)) {
    const pjson = JSON.parse(fs.readFileSync(pjsonPath, 'utf8'));
    const isExtension = !!pjson.engines && !!pjson.engines.vscode;
    inventory[pkg] = {
      name: pjson.name,
      isExtension,
      version: pjson.version,
      dependencies: pjson.dependencies || {},
      devDependencies: pjson.devDependencies || {},
      commands: (pjson.contributes && pjson.contributes.commands) ? pjson.contributes.commands.map(c => c.command) : [],
      webviews: (pjson.contributes && pjson.contributes.views) ? true : false,
      treeviews: (pjson.contributes && pjson.contributes.viewsContainers) ? true : false,
      hasTests: fs.existsSync(path.join(packagesDir, pkg, 'tests'))
    };
  }
}
console.log(JSON.stringify(inventory, null, 2));
