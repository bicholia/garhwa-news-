const fs = require('fs');
const path = require('path');

const files = [
    "c:\\Users\\LAPPY PLUS\\OneDrive\\Desktop\\NR Daily news\\garhwa-news\\app\\api\\admin\\profile\\route.ts",
    "c:\\Users\\LAPPY PLUS\\OneDrive\\Desktop\\NR Daily news\\garhwa-news\\app\\api\\admin\\posts\\[id]\\route.ts",
    "c:\\Users\\LAPPY PLUS\\OneDrive\\Desktop\\NR Daily news\\garhwa-news\\app\\api\\admin\\posts\\route.ts",
    "c:\\Users\\LAPPY PLUS\\OneDrive\\Desktop\\NR Daily news\\garhwa-news\\app\\api\\admin\\posts\\create\\route.ts",
    "c:\\Users\\LAPPY PLUS\\OneDrive\\Desktop\\NR Daily news\\garhwa-news\\app\\api\\admin\\media\\upload\\route.ts",
    "c:\\Users\\LAPPY PLUS\\OneDrive\\Desktop\\NR Daily news\\garhwa-news\\app\\api\\admin\\global-ads\\route.ts",
    "c:\\Users\\LAPPY PLUS\\OneDrive\\Desktop\\NR Daily news\\garhwa-news\\app\\api\\admin\\ads\\route.ts"
];

let replaced = 0;

for (const f of files) {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf-8');
        const search = "dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,";
        const replace = "dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',";

        if (content.includes(search)) {
            content = content.replace(search, replace);
            fs.writeFileSync(f, content, 'utf-8');
            replaced++;
        }
    }
}

console.log(`Replaced in ${replaced} files.`);
