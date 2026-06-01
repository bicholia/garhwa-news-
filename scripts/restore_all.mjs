import { execSync } from 'child_process';

const scriptsToRun = [
    'publish_chat_news_batch1.mjs',
    'publish_chat_news_batch2.mjs',
    'publish_final_news.mjs',
    'publish_rupesh_news.mjs',
    'publish_today_news_2026_05_07.mjs'
];

for (const script of scriptsToRun) {
    console.log(`\n\n=== Running ${script} ===`);
    try {
        execSync(`node -e "import fs from 'fs'; let content = fs.readFileSync('${script}', 'utf8'); content = content.replace(/dotenv\\.config\\(\\{ path: '\\.env\\.local' \\}\\);/g, 'dotenv.config({ path: \\'../.env.local\\' }); if(!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) dotenv.config({ path: \\'../.env.production.local\\' });'); fs.writeFileSync('${script}', content);"`);
        
        const output = execSync(`node ${script}`);
        console.log(output.toString());
    } catch (err) {
        console.error(`Failed to run ${script}:`, err.message);
        if (err.stdout) console.log(err.stdout.toString());
        if (err.stderr) console.error(err.stderr.toString());
    }
}
