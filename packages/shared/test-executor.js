const { ProcessExecutor } = require('./dist/index.js');
async function run() {
  const executor = new ProcessExecutor();
  console.log("Spawning python...");
  try {
    const result = await executor.execute({
      command: 'python3',
      args: ['/home/kanak/Desktop/New Folder (1)/test-harness/suite/infinite.py'],
      cwd: __dirname
    });
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
run();
