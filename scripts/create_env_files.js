const fs = require('fs');

const envs = {
    'tmp_cron.txt': 'nr_daily_news_secret_2026',
    'tmp_sid.txt': 'cjfr2ckk',
    'tmp_ds.txt': 'production'
};

for (const [file, value] of Object.entries(envs)) {
    fs.writeFileSync(file, value);
    console.log(`Created ${file} with value: ${value}`);
}
