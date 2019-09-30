const Discord = require('discord.js');
const client = new Discord.Client();

const LolesportsPoller = require('./lib/lolesports-poller');

async function start() {
  client.on('ready', () => {
    console.log('logged in');
  });

  client.on('message', message => {
    if (message.content === '!ping') {
      message.reply('pong');
    }
  });

  const token = process.env['TOKEN'];
  if (!token) {
    console.log('No bot token was specified.');
    process.exit(1);
  }

  await client.login(token);
  
  const lolesportsChannelId = process.env['LOLESPORTS_CHANNEL_ID'];
  if (lolesportsChannelId) {
    await LolesportsPoller.start(client, lolesportsChannelId);
  }
}

start();
