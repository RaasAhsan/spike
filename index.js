const Discord = require('discord.js');
const client = new Discord.Client();

const moment = require('moment');

const LolesportsPoller = require('./lib/lolesports-poller');

const startTime = moment();

async function start() {
  client.on('ready', () => {
    console.log('Logged in');
  });

  client.on('message', message => {
    if (message.content === '!ping') {
      message.reply('pong');
    } else if (message.content === '!uptime') {
      const uptime = startTime.fromNow(true);
      message.reply(`I have been running for ${uptime}.`);
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
