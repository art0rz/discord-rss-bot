# Discord RSS bot
This is a simple Discord bot that reads RSS feeds and posts new articles. It remembers when it last checked for articles, and posts only new ones.

# Usage
1. Set the right environment variables (see below)
2. Run `yarn run start` or `npm run start`

# Environment variables
```
FEED_URLS=[list of RSS feed URLs]
WEBHOOK_URL=[Discord webhook URL]
```
A .env file is also supported.

`FEED_URLS` is a comma-separated list of RSS feed URLs, e.g.:
```
FEED_URLS=FEED_URLS=http://feeds.feedburner.com/metalinjection,https://hnrss.org/frontpage
```

`WEBHOOK_URL` is the URL Discord provides you with when you create a [webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks). It should look something like this: `https://discord.com/api/webhooks/CHANNEL_ID/TOKEN`

