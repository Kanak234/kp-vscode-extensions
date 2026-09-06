const fs = require('fs');
const path = require('path');
const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir).filter(p => fs.statSync(path.join(packagesDir, p)).isDirectory());

const graph = {};
for (const pkg of packages) {
  const pjsonPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pjsonPath)) {
    const pjson = JSON.parse(fs.readFileSync(pjsonPath, 'utf8'));
    if (!pjson.engines || !pjson.engines.vscode) continue;
    
    graph[pkg] = {
      name: pjson.name,
      commands: pjson.contributes?.commands?.map(c => c.command) || [],
      activationEvents: pjson.activationEvents || [],
      webviews: pjson.contributes?.views ? true : false,
      treeviews: pjson.contributes?.viewsContainers ? true : false,
      dependencies: Object.keys(pjson.dependencies || {}),
    };
  }
}
fs.writeFileSync('extension-graph.json', JSON.stringify(graph, null, 2));
console.log('Graph built.');
