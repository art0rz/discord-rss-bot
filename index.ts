require('dotenv').config();

import fetch from 'node-fetch';
import Parser from 'rss-parser';
import {isBefore, fromUnixTime} from 'date-fns';

import {statSync, writeFileSync} from 'fs';

const FEED_URL = process.env.FEED_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const LASTCHECK_FILE = 'lastcheck';

const getRSS = async () => {
    await (await fetch(FEED_URL)).text();

    const parser = new Parser();
    const feed = await parser.parseURL(FEED_URL);

    return feed.items;
}


const post = async (content: string) =>
    await fetch(WEBHOOK_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: content
        })
    });

const getTimeOfLastCheck = () => {
    try {
        const stat = statSync(LASTCHECK_FILE);

        return stat.mtime;
    } catch (e) {
        return fromUnixTime(0);
    }
}

const writeLastCheckFile = () => writeFileSync('lastcheck', '');

(async () => {
    const items = await getRSS();

    const lastCheck = getTimeOfLastCheck();
    const newItems = items.filter(item => isBefore(lastCheck, new Date(item.pubDate)));
    newItems.forEach(item => post(`${item.title} ${item.guid}`));

    if (newItems.length > 0) {
        console.log(`Posted ${newItems.length} new articles`);
    } else {
        console.log('No new articles to post')
    }

    writeLastCheckFile();
})();
