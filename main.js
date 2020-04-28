const SocksAgent = require('socks5-https-client/lib/Agent');
const { Telegraf } = require('telegraf');
const fs = require('fs').promises;

const TOKEN_FILE = 'Tokenfile';
const PROXY_FILE = 'Proxyfile';

const main = async () => {
  const token = await fs.readFile(TOKEN_FILE, 'utf-8');
  const proxy = JSON.parse(await fs.readFile(PROXY_FILE, 'utf-8'));

  try {
    const botOptions = {
      telegram: {
        agent: new SocksAgent(proxy),
      },
    };

    const bot = new Telegraf(token, botOptions);

    bot.start((ctx) => ctx.reply('Welcome!'));
    bot.help((ctx) => ctx.reply('Send me a sticker'));
    bot.on('sticker', (ctx) => ctx.reply('👍'));
    bot.hears('hi', (ctx) => ctx.reply('Hey there'));

    bot.launch();
    console.log('[BOT] Initialized.');
  } catch (err) {
    console.error(err);
  }
};

main();
