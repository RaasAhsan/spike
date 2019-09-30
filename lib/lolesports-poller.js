const axios = require('axios');

const apiUrl = 'https://prod-relapi.ewp.gg/persisted/gw';
const apiKey = '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z';

const client = axios.create({
  baseURL: apiUrl,
  headers: {
    'x-api-key': apiKey
  }
});

const subscribedLeagues = ['LCS', 'LEC', 'LCK'];

function sleep(millis) {
  return new Promise((resolve, reject) => setTimeout(resolve, millis));
}

async function getLiveEvents() {
  const response = await client.get(`${apiUrl}/getLive?hl=en-US`);
  return response.data.data.schedule.events;
}

function generateEventMessage(event) {
  const league = event.league;
  const blockName = event.blockName;
  const teamA = event.match.teams[0].code;
  const teamB = event.match.teams[1].code;
  const message = `**${league} ${blockName}** - **${teamA} vs ${teamB}** is starting shortly (<https://watch.na.lolesports.com/en_US/${league}/en>)`;
  return message;
}

async function start(client, channelId) {
  console.log('Starting lolesports poller...');

  let lastEvents = [];
  try {
    const events = await getLiveEvents();
    if (events) {
      lastEvents = events;
    }
  } catch (error) {
    console.error(error);
  }

  while (true) {
    await sleep(10000);

    try {
      const events = await getLiveEvents();
      if (!events) {
        lastEvents = [];
        continue;
      }

      for (const event of events) {
        if (!event.hasOwnProperty('match')) {
          continue;
        }

        const matchId = event.match.id;
        if (lastEvents.find(l => l.hasOwnProperty('match') && l.match.id === matchId)) {
          continue;
        }

        const league = event.league.name;
        if (!subscribedLeagues.includes(league)) {
          continue;
        }

        const channel = client.channels.get(channelId);
        await channel.send(generateEventMessage(event));
      }

      lastEvents = events;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  start
};
