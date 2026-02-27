const { spawn } = require('child_process');

let child;

const start = () => {
    if (child) child.kill();
    child = spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true });
    child.on('exit', (code) => {
        if (code !== 0 && code !== null) {
            console.log('\n⚠️ Dev server crashed. Restarting in 2 seconds...\n');
            setTimeout(start, 2000);
        }
    });
};

start();
