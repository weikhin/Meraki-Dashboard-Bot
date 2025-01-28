var Framework = require('webex-node-bot-framework');
var axios = require("axios"); // npm install axios
var QuickChart = require('quickchart-js'); // npm install quickchart-js
var ACData = require("adaptivecards-templating"); // npm install adaptivecards-templating
var orgId = '######'; // Replace with your specific Org ID
var merakiApiKey = '############################################'; // Replace with your Meraki API key
var merakiBaseUrl = 'https://api.meraki.com/api/v1';


// list the rooms and users this is allowed to interact with this bot here
// get the room ID by adding astronaut@webex.bot to the space (bot will leave and direct message you with the room ID)
// OR 1:1 message astronaut@webex.bot with an @Mention of the Space name

const allowedRooms = ['################################################################################']; // Replace with the allowed room ID(s)
const allowedUsers = ['john@abc.com','ben@abc.com']; // Replace with allowed user email(s)


// framework options
var config = {
  // No webhookUrl, webhookSecret, or port needed
     token: '##############################################################################################################' //Replace with your Bot Token
  };

// init framework
var framework = new Framework(config);
framework.start();

// Helper function to check if a space is authorized
const isRoomAuthorized = (roomId) => allowedRooms.includes(roomId);

// Helper function to check if a user is authorized
const isUserAuthorized = (personEmail) => allowedUsers.includes(personEmail);

// Remove the bot from unauthorized spaces
const removeUnauthorizedSpaces = async (framework) => {
    try {
      const spaces = await framework.webex.rooms.list();
      for (const room of spaces.items) {
        // Skip 1-to-1 spaces
        if (room.type === 'direct') {
          console.log(`Skipping 1-to-1 room: ${room.title} (ID: ${room.id})`);
          continue;
        }
  
        // Check if the room is unauthorized
        if (!isRoomAuthorized(room.id)) {
          console.log(`Removing bot from unauthorized room: ${room.title} (ID: ${room.id})`);
          await framework.webex.memberships.list({ roomId: room.id }).then((memberships) => {
            const botMembership = memberships.items.find((member) => member.personId === framework.person.id);
            if (botMembership) {
              framework.webex.memberships.remove(botMembership.id);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error while removing unauthorized spaces:', error.message);
    }
  };


// An initialized event means your webhooks are all registered and the
// framework has created a bot object for all the spaces your bot is in
framework.on("initialized", () => {
  framework.debug("Framework initialized successfully! [Press CTRL-C to quit]");
  removeUnauthorizedSpaces(framework); // Remove unauthorized spaces at startup
});

// A spawn event is generated when the framework finds a space with your bot in it
// You can use the bot object to send messages to that space
// The id field is the id of the framework
// If addedBy is set, it means that a user has added your bot to a new space
// Otherwise, this bot was in the space before this server instance started
framework.on('spawn', (bot, id, addedBy) => {
  if (!addedBy) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    framework.debug(`Framework created an object for an existing bot in a space called: ${bot.room.title}`);
  } else {
    if (isRoomAuthorized(bot.room.id)) {
      bot.say('Hi there, you can say hello to me. Don\'t forget you need to mention me in a group space!');
    } else {
      framework.debug(`Bot added to an unauthorized space: ${bot.room.title} (ID: ${bot.room.id})`);
      bot.exit();
    }
  }
});

// Implementing a framework.on('log') handler allows you to capture
// events emitted from the framework.  Its a handy way to better understand
// what the framework is doing when first getting started, and a great
// way to troubleshoot issues.
// You may wish to disable this for production apps

/*
framework.on("log", (msg) => {
    console.log(msg);
  });
*/

// Helper function to check if a message is from an allowed room or user
const isAuthorized = (roomId, personEmail) => {
    return allowedRooms.includes(roomId) || allowedUsers.includes(personEmail);
	  };

// Process incoming messages
// Each hears() call includes the phrase to match, and the function to call if webex mesages
// to the bot match that phrase.
// An optional 3rd parameter can be a help string used by the frameworks.showHelp message.
// An optional fourth (or 3rd param if no help message is supplied) is an integer that
// specifies priority.   If multiple handlers match they will all be called unless the priority
// was specified, in which case, only the handler(s) with the lowest priority will be called

/* On mention with command
ex User enters @botname Utilization, the bot will reply with the top 10 appliances sorted by utilization in the last 1 day
*/

framework.hears("Utilization", async (bot, trigger) => {
    if (!isAuthorized(trigger.message.roomId, trigger.message.personEmail)) {
        framework.debug(`Unauthorized access attempt by ${trigger.person.email} in room ${trigger.message.roomId}`);
        bot.reply(trigger.message, "Sorry, you don't have permission to use this bot.");
        return;
      }
    try {
        const response = await axios.get(`${merakiBaseUrl}/organizations/${orgId}/summary/top/appliances/byUtilization`, {
            headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey }
        });
        // console.log(response.data)
        const appliances = response.data;
        if (Array.isArray(appliances) && appliances.length > 0) {
          const topAppliances = appliances.slice(0, 10);
          let message = 'Top 10 Appliances by Utilization:\n';
  
          topAppliances.forEach((appliance, index) => {
            message += `${index + 1}. **Name:** ${appliance.name || 'Unknown'}, **Network id:** ${appliance.network.id || 'Unknown'}, **Model:** ${appliance.model || 'Unknown'}, **Utilization:** ${appliance.utilization.average.percentage.toFixed(2) || 'Unknown'}%\n`;
        });
        bot.reply(trigger.message, message, "markdown");
  
        } else {
            bot.reply(trigger.message, 'No appliances found or data format unexpected.');
        }
    } catch (error) {
        console.error('Error retrieving appliance utilization:', error.response ? error.response.data : error.message);
        bot.reply(trigger.message, 'Sorry, there was an error retrieving the appliance utilization information.');
    }
  },
      
   
      "**Utilization**: (Meraki Top appliances sorted by utilization in the last 1 day)",
        0
  );
  
  

/* On mention with command
ex User enters @botname help, the bot will write back in markdown
 *
 * The framework.showHelp method will use the help phrases supplied with the previous
 * framework.hears() commands
*/
framework.hears(
    /help|what can i (do|say)|what (can|do) you do/i,
    (bot, trigger) => {
        if (isAuthorized(trigger.message.roomId, trigger.message.personEmail)) {
            bot
              .say(`Hello ${trigger.person.displayName}.`)
              .then(() => bot.say("markdown", framework.showHelp()))
              .catch((e) => console.error(`Problem in help handler: ${e.message}`));
          } else {
            bot.reply(trigger.message, "Sorry, you don't have permission to use this bot.");
          }
        }, "**help**: (what you are reading now)", 0);


// say hello
framework.hears('hello', (bot, trigger) => {
    if (isAuthorized(trigger.message.roomId, trigger.message.personEmail)) {
      bot.say(`Hello ${trigger.person.displayName}.`)
        .then(() => bot.say("markdown", framework.showHelp()))
        .catch((e) => console.error(`Problem in hello handler: ${e.message}`));
    } else {
      bot.reply(trigger.message, "Sorry, you don't have permission to use this bot.");
    }
  }, 0);

/*
// echo user input
framework.hears('echo', (bot, trigger) => {
  bot.say('markdown', `You said: ${trigger.prompt}`);
}, '**echo** - I\'ll echo back the rest of your message');
 */

// Its a good practice to handle unexpected input
// Setting a priority > 0 means this will be called only if nothing else matches
framework.hears(/.*/gim, (bot, trigger) => {
    if (isAuthorized(trigger.message.roomId, trigger.message.personEmail)) {
      bot.say('Sorry, I don\'t know how to respond to "%s"', trigger.message.text);
      bot.say('markdown', framework.showHelp());
    } else {
      bot.reply(trigger.message, "Sorry, you don't have permission to use this bot.");
    }
  }, 99999);

// gracefully shutdown (ctrl-c)
// This is especially important when using websockets
// as it cleans up the socket connection. Failure to do
// this could result in an "excessive device registrations"
// error during the iterative development process
process.on('SIGINT', () => {
  framework.debug('stoppping...');
//  server.close();
  framework.stop().then(() => {
      process.exit();
  });
});