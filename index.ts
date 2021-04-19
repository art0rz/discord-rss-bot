require('dotenv').config();

import fetch from 'node-fetch';
import Parser from 'rss-parser';
import {isBefore, fromUnixTime} from 'date-fns';

import {statSync, writeFileSync} from 'fs';

const FEED_URLS = process.env.FEED_URLS.split(',');
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const LASTCHECK_FILE = 'lastcheck';

const getRSS = async (url) => {
    const parser = new Parser();
    const feed = await parser.parseURL(url);

    return feed;
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
    const lastCheck = getTimeOfLastCheck();

    for (const url of FEED_URLS) {
        console.log(`[${new Date()}] fetching ${url}`)
        const { items, title } = await getRSS(url);
        const newItems = items.filter(item => isBefore(lastCheck, new Date(item.pubDate)));
        newItems.forEach(item => post(`[${title}] ${item.title} ${item.link}`));

        if (newItems.length > 0) {
            console.log(`[${new Date()}] [${title}] Posted ${newItems.length} new articles`);
        } else {
            console.log(`[${new Date()}] [${title}] No new articles to post from ${title}`);
        }
    }

    writeLastCheckFile();
})();
