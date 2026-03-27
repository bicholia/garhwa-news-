import Parser from 'rss-parser';
const parser = new Parser();

const FEEDS = [
    'https://www.prabhatkhabar.com/state/jharkhand/garhwa/feed',
    'https://www.prabhatkhabar.com/state/jharkhand/palamu/feed',
    'https://www.livehindustan.com/jharkhand/garhwa/feed.rss'
];

async function checkFeeds() {
    console.log('Checking feeds for new items...');
    for (const url of FEEDS) {
        try {
            console.log(`\nFeed: ${url}`);
            const feed = await parser.parseURL(url);
            const latest = feed.items[0];
            if (latest) {
                console.log(`- Latest Title: ${latest.title}`);
                console.log(`- Pub Date: ${latest.pubDate}`);
            }
        } catch (e) {
            console.log(`Error reading ${url}: ${e.message}`);
        }
    }
}

checkFeeds();
