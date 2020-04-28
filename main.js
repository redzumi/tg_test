const fs = require('fs').promises;
const { Telegraf } = require('telegraf');

const SocksAgent = require('socks5-https-client/lib/Agent');
const TelegrafInlineMenu = require('telegraf-inline-menu');

const TOKEN_FILE = 'Tokenfile';
const PROXY_FILE = 'Proxyfile';

const runApp = (bot) => {
  const menu = new TelegrafInlineMenu(
    (ctx) => `Привет, ${ctx.from.first_name}!`
  );

  menu.setCommand('question');

  menu.simpleButton('Просто кнопка', 'simple-button', {
    doFunc: (ctx) => ctx.reply('Просто ответ, лол'),
  });

  menu.question('Задать вопрос', 'ask', {
    uniqueIdentifier: 'ask',
    questionText: 'Что ты хочешь спросить?',
    setFunc: (_ctx, key) => {
      _ctx.reply(`Твой вопрос: ${key}, мой ответ: нет.`);
    },
  });

  bot.start((ctx) => ctx.reply('Привет!'));
  bot.help((ctx) => ctx.reply('Отправь мне стикер'));
  bot.on('sticker', (ctx) => ctx.reply('👍'));
  bot.hears('hi', (ctx) => ctx.reply('Ну привет'));

  bot.use(menu.init());
  bot.startPolling();
  bot.launch();
};

const main = async () => {
  const token = await fs.readFile(TOKEN_FILE, 'utf-8');
  const proxy = JSON.parse(await fs.readFile(PROXY_FILE, 'utf-8'));

  try {
    const botOptions = {
      telegram: {
        agent: new SocksAgent(proxy),
      },
    };

    runApp(new Telegraf(token, botOptions));
    console.log('[BOT] Initialized.');
  } catch (err) {
    console.error(err);
  }
};

main();
