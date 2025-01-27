var Framework = require('webex-node-bot-framework');
var axios = require("axios");
var QuickChart = require('quickchart-js'); // npm install quickchart-js
var ACData = require("adaptivecards-templating"); // npm install adaptivecards-templating
var orgId = '537758'; // Replace with your specific Org ID
var merakiApiKey = '40ab3b2bc53f0b17768bd1d5e1d401c8d803b588'; // Replace with your Meraki API key
var merakiBaseUrl = 'https://api.meraki.com/api/v1';


// No express server needed when running in websocket mode

// framework options
var config = {
  // No webhookUrl, webhookSecret, or port needed
//  token: 'MDY3YWY1NGUtNTU3Ny00ZWFhLWE1YjItMTI3ZjMzNGVhYjVkNWNjYTJlZDQtZjc4_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f' //dtmeraki1@webex.bot
//   token: 'MWU5ZmE5MGUtZGU5Mi00NDczLWE2ODgtZTFiNmY1YzVhNDEwOWU3YTFiZmMtMmNh_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f' //dtwebsocket1@webex.bot
    token: 'MzgyNTIzNWItZmNiYy00NDRhLWIwMmUtMWY0OTY4ZTYyMTUzMjc4ZDExMGMtMjgx_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f' //dtmeraki2@webex.bot
};

// init framework
var framework = new Framework(config);
framework.start();

// An initialized event means your webhooks are all registered and the
// framework has created a bot object for all the spaces your bot is in
framework.on("initialized", () => {
  framework.debug("Framework initialized successfully! [Press CTRL-C to quit]");
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
    // addedBy is the ID of the user who just added our bot to a new space,
    // Say hello, and tell users what you do!
    bot.say('Hi there, you can say hello to me.  Don\'t forget you need to mention me in a group space!');
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
  ex User enters @botname Devices, the bot will reply with the top 10 devices sorted by data usage in the last 1 day in megabytes
  */
  
  framework.hears("Devices", async (bot, trigger) => {
    try {
        const response = await axios.get(`${merakiBaseUrl}/organizations/${orgId}/summary/top/devices/byUsage`, {
            headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey }
        });
        // console.log(response.data)
        const devices = response.data;
        if (Array.isArray(devices) && devices.length > 0) {
          const topDevices = devices.slice(0, 10);
          let message = 'Top 10 Devices by Data Usage in megabytes:\n';
  
          topDevices.forEach((devices, index) => {
            message += `${index + 1}. **Name:** ${devices.name || 'Unknown'}, **Network id:** ${devices.network.id || 'Unknown'}, **Usage:** ${devices.usage.total.toFixed(2) || 'Unknown'} megabytes\n`;
        });
        bot.reply(trigger.message, message, "markdown");
  
  
        } else {
            bot.reply(trigger.message, 'No devices found or data format unexpected.');
        }
    } catch (error) {
        console.error('Error retrieving devices usage:', error.response ? error.response.data : error.message);
        bot.reply(trigger.message, 'Sorry, there was an error retrieving the devices usage information.');
    }
  },
      
   
      "**Devices**: (Meraki Top devices sorted by data usage in the last 1 day in megabytes)",
        0
  );
  
  /* On mention with command
  ex User enters @botname SSID, the bot will reply with the top 10 ssids by data usage in the last 1 day in megabytes
  */
  
  framework.hears("SSID", async (bot, trigger) => {
    try {
        const response = await axios.get(`${merakiBaseUrl}/organizations/${orgId}/summary/top/ssids/byUsage`, {
            headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey }
        });
        // console.log(response.data)
        const ssid = response.data;
        if (Array.isArray(ssid) && ssid.length > 0) {
          const topSSID = ssid.slice(0, 10);
          let message = 'Top 10 SSID by Data Usage in megabytes:\n';
  
          topSSID.forEach((ssid, index) => {
            message += `${index + 1}. **Name:** ${ssid.name || 'Unknown'}, **Clients:** ${ssid.clients.counts.total || 'Unknown'}, **Usage:** ${ssid.usage.total.toFixed(2) || 'Unknown'} megabytes\n`;
        });
        bot.reply(trigger.message, message, "markdown");
  
  
        } else {
            bot.reply(trigger.message, 'No SSID found or data format unexpected.');
        }
    } catch (error) {
        console.error('Error retrieving devices usage:', error.response ? error.response.data : error.message);
        bot.reply(trigger.message, 'Sorry, there was an error retrieving the SSID information.');
    }
  },
      
   
      "**SSID**: (Meraki Top SSID by data usage in the last 1 day in megabytes)",
        0
  );
  
  /* On mention with command
  ex User enters @botname Application, the bot will reply with the top application categories sorted by data usage in the last 1 day in megabytes.
  */
  
  framework.hears("Application", async (bot, trigger) => {
    try {
        const response = await axios.get(`${merakiBaseUrl}/organizations/${orgId}/summary/top/applications/categories/byUsage`, {
            headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey }
        });
        // console.log(response.data)
        const application = response.data;
        if (Array.isArray(application) && application.length > 0) {
          const topAPP = application.slice(0, 10);
          let message = 'Top 10 Application Categories by Data Usage in megabytes:\n';
  
          topAPP.forEach((application, index) => {
            message += `${index + 1}. **Categories:** ${application.category || 'Unknown'}, **Total:** ${application.total.toFixed(2) || 'Unknown'}, **Downstream:** ${application.downstream.toFixed(2) || 'Unknown'}, **Upstream:** ${application.upstream.toFixed(2) || 'Unknown'}, **Percentage:** ${application.percentage.toFixed(2) || 'Unknown'}%\n`;
        });
        bot.reply(trigger.message, message, "markdown");
  
  
        } else {
            bot.reply(trigger.message, 'No Application Categories or data format unexpected.');
        }
    } catch (error) {
        console.error('Error retrieving devices usage:', error.response ? error.response.data : error.message);
        bot.reply(trigger.message, 'Sorry, there was an error retrieving the Application Categories information.');
    }
  },
      
   
      "**Application**: (Meraki Top Application Categories by data usage in the last 1 day in megabytes)",
        0
  );
  
  /* On mention with command
  ex User enters @botname Clients, the bot will reply with the top 10 clients by data usage in the last 1 day in megabytes.
  */
  
  framework.hears("Clients", async (bot, trigger) => {
    try {
        const response = await axios.get(`${merakiBaseUrl}/organizations/${orgId}/summary/top/clients/byUsage`, {
            headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey }
        });
        // console.log(response.data)
        const clients = response.data;
        if (Array.isArray(clients) && clients.length > 0) {
          const topClients = clients.slice(0, 10);
          let message = 'Top 10 Clients by Data Usage in megabytes:\n';
  
          topClients.forEach((clients, index) => {
            message += `${index + 1}. **Name:** ${clients.name || 'Unknown'}, **Network id:** ${clients.network.id || 'Unknown'}, **Total:** ${clients.usage.total.toFixed(2) || 'Unknown'}, **Downstream:** ${clients.usage.downstream.toFixed(2) || 'Unknown'}, **Upstream:** ${clients.usage.upstream.toFixed(2) || 'Unknown'}, **Percentage:** ${clients.usage.percentage.toFixed(2) || 'Unknown'}%\n`;
        });
        bot.reply(trigger.message, message, "markdown");
  
  
        } else {
            bot.reply(trigger.message, 'No Clients data or data format unexpected.');
        }
    } catch (error) {
        console.error('Error retrieving devices usage:', error.response ? error.response.data : error.message);
        bot.reply(trigger.message, 'Sorry, there was an error retrieving the Application Categories information.');
    }
  },
      
   
      "**Clients**: (Meraki Top Clients data usage in the last 1 day in megabytes)",
        0
  );


  /* On mention with command
  ex User enters @botname boot, the bot will reply with the devices boots history the last 24 hrs
  */
  
  framework.hears("BOOT", async (bot, trigger) => {
    try {
        const last7days = 7 * 24 * 60 * 60;
        const response = await axios.get(`${merakiBaseUrl}/organizations/${orgId}/devices/boots/history`, {
            headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey },
            params: { timespan : last7days }
        });
        // console.log(response.data)
        const bootsHistory = response.data;


        if (Array.isArray(bootsHistory) && bootsHistory.length > 0) {
          let message = 'Device Boot History in the last 7 days:\n';
    
          bootsHistory.forEach((boot, index) => {
            message += `${index + 1}. **Serial:** ${boot.serial || 'Unknown'}, **Network ID:** ${boot.network.id || 'Unknown'}, **Boot Time:** ${boot.start.bootedAt || 'Unknown'}\n`;
          });
    
          bot.reply(trigger.message, message, "markdown");
        } else {
          bot.reply(trigger.message, 'No boot history found or data format unexpected.');
        }
      } catch (error) {
        console.error('Error retrieving boot history:', error.response ? error.response.data : error.message);
        bot.reply(trigger.message, 'Sorry, there was an error retrieving the boot history.');
      }
    }, 
    
    "**Boot**: (Retrieve Meraki device boot history for the last 7 days)",
     0
);
 
  /* On mention with command
  ex User enters @botname Alerts, the bot will Return Oldest 30 active critical health alerts for an organization.
  */
  
  framework.hears("Alerts", async (bot, trigger) => {
    try {
        const response = await axios.get(`${merakiBaseUrl}/organizations/${orgId}/assurance/alerts`, {
            headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey },
            params: { active : true, sortOrder: 'ascending', severity: 'critical' }
        });
        // console.log(response.data)
        const alerts = response.data;
        if (Array.isArray(alerts) && alerts.length > 0) {
          const topAlerts = alerts.slice(0, 30);
          let message = 'Top 30 Active Critical Alerts in Ascending Order:\n';
  
          topAlerts.forEach((alerts, index) => {
            message += `${index + 1}. **Alert ID:** ${alerts.id || 'Unknown'}, **Network id:** ${alerts.network.id || 'Unknown'}, **Started:** ${alerts.startedAt || 'Unknown'}, **Device Type:** ${alerts.deviceType || 'Unknown'}, **Alert Type:** ${alerts.type || 'Unknown'}, **Alert Severity:** ${alerts.severity || 'Unknown'}\n`;
        });
        bot.reply(trigger.message, message, "markdown");
  
  
        } else {
            bot.reply(trigger.message, 'No Alerts or data format unexpected.');
        }
    } catch (error) {
        console.error('Error retrieving devices usage:', error.response ? error.response.data : error.message);
        bot.reply(trigger.message, 'Sorry, there was an error retrieving the Application Categories information.');
    }
  },
      
   
      "**Alerts**: (Meraki Oldest 30 Active Critical Health Alerts for the organization)",
        0
  );


/* On mention with command
ex User enters @botname List Status, the bot will List Dormant and Offline Devices
*/

framework.hears(/device status|status/i, async (bot, trigger) => {
  const listSize = 10;
  let list = 0;
  bot.list = list;
  bot.reply(trigger.message, { markdown: 'Fetching Dormant and Offline Devices, please wait...' });

 try {
        // Fetch Network ID information
        const response = await axios.get(
            `${merakiBaseUrl}/organizations/${orgId}/devices/availabilities`,
            {
                headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey },
               params: { statuses : ['dormant','offline'] }
            }
        );
    //	console.log(response.data)
    // Process the response
  const data = response.data;

  if (data && data.length > 0) {
    const totalLists = data.length;
    const ListedData = data.slice(list * listSize, (list + 1) * listSize);

    const statusList = ListedData.map((device, index) => {
      return `${list * listSize + index + 1}. **Name:** ${device.name || 'Unknown'}, **Serial:** ${device.serial || 'Unknown'}, **Status:** ${device.status}`;
    });

    bot.reply(trigger.message, { markdown: `Here are ${listSize} results (Page ${list + 1}):\n${statusList.join('\n')}` });

    if ((list + 1) * listSize < totalLists) {
      bot.reply(trigger.message, { markdown: `Type \`next List\` to see the next ${listSize} results.` });
    }
  } else {
    bot.reply(trigger.message, { markdown: 'No devices are in dormant or offline status.' });
  }
} catch (error) {
  console.error('Error fetching Device Status Information:', error);
  bot.reply(trigger.message, { markdown: 'There was an error fetching Device Status Information. Please try again later.' });
}
});

framework.hears(/next List/i, async (bot, trigger) => {
const listSize = 10;
let list = bot.list || 1;

  try {
        // Fetch Network ID information
        const response = await axios.get(
            `${merakiBaseUrl}/organizations/${orgId}/devices/availabilities`,
            {
                headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey },
               params: { statuses : ['dormant','offline'] }
            }
        );

    // Process the response
  const data = response.data;

  if (data && data.length > 0) {
    const totalLists = data.length;
    const ListedData = data.slice(list * listSize, (list + 1) * listSize);

    const statusList = ListedData.map((device, index) => {
      return `${list * listSize + index + 1}. **Name:** ${device.name || 'Unknown'}, **Serial:** ${device.serial || 'Unknown'}, **Status:** ${device.status}\n`;
    });

    bot.reply(trigger.message, { markdown: `Here are ${listSize} results (Page ${list + 1}):\n\n${statusList.join('\n')}` });

    if ((list + 1) * listSize < totalLists) {
      bot.reply(trigger.message, { markdown: `Type \`next List\` to see the next ${listSize} results.` });
  } else {
    bot.reply(trigger.message, { markdown: 'No additional Device Status Information found.' });
  }
  bot.list = list + 1;
  
} else {
bot.reply(trigger.message, { markdown: 'No additional Device Status information found.' });
    }

} catch (error) {
  console.error('Error fetching Device Status Information:', error);
  bot.reply(trigger.message, { markdown: 'There was an error fetching Device Status Information. Please try again later.' });
}
},

    
"**List Status**: (List Dormant and Offline Devices)",
      0

);


/* On mention with command
ex User enters @botname List Network, the bot list Network ID for all wireless product
*/

/* Reusable function to fetch data from Meraki API */
async function fetchData(url, params = {}) {
  try {
    const response = await axios.get(url, {
      headers: { "X-Cisco-Meraki-API-Key": merakiApiKey },
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    throw new Error("API Request Failed");
  }
}

framework.hears(/list Network/i, async (bot, trigger) => {
  try {
    // Inform the user
    await bot.reply(trigger.message, {
      markdown: "Fetching Network ID information for wireless products, please wait...",
    });

    // Fetch Network ID information
    const networks = await fetchData(
      `${merakiBaseUrl}/organizations/${orgId}/networks`,
      { productTypes: ["wireless"] }
    );

    if (!networks || networks.length === 0) {
      return bot.reply(trigger.message, { markdown: "No wireless Network IDs found." });
    }

    // Prepare Adaptive Card JSON template
    const cardTemplate = {
      type: "AdaptiveCard",
      body: [
        {
          type: "Input.ChoiceSet",
          id: "networkId",
          style: "compact",
          choices: networks.map(({ id, name }) => ({
            title: `${name || "Unknown Network"} (ID: ${id})`,
            value: id,
          })),
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Get Stats",
        },
      ],
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.2",
    };

    // Send the card
    await bot.sendCard(cardTemplate, "Please select a Network ID to view connection stats.");
  } catch (error) {
    console.error("Error during 'list network':", error.message);
    await bot.reply(trigger.message, {
      markdown: "An error occurred while fetching Network IDs. Please try again later.",
    });
  }
},

			
	"**List Network**: (List Network ID stats for the last 7 days)",
		   0
);

framework.on("attachmentAction", async (bot, trigger) => {
  const { networkId } = trigger.attachmentAction.inputs;

  if (!networkId) {
    return bot.reply(trigger.attachmentAction, {
      markdown: "No Network ID selected. Please try again.",
    });
  }

  try {
    await bot.reply(trigger.attachmentAction, {
      markdown: `Fetching connection stats for Network ID **${networkId}**, please wait...`,
    });

    // Fetch connection stats for the last 7 days
    const stats = await fetchData(
      `${merakiBaseUrl}/networks/${networkId}/wireless/connectionStats`,
      { timespan: 7 * 24 * 60 * 60 } // Last 7 days in seconds
    );

    if (stats) {
      const message = `Connection Stats for Network ID **${networkId}**:
      - **Failed Association Attempts:** ${stats.assoc || 0}
      - **Failed Authentication Attempts:** ${stats.auth || 0}
      - **Failed DHCP Attempts:** ${stats.dhcp || 0}
      - **Failed DNS Attempts:** ${stats.dns || 0}
      - **Successful Connection Attempts:** ${stats.success || 0}`;

      await bot.reply(trigger.attachmentAction, { markdown: message });
    } else {
      await bot.reply(trigger.attachmentAction, {
        markdown: `No connection stats found for Network ID **${networkId}**.`,
      });
    }
  } catch (error) {
    console.error("Error fetching connection stats:", error.message);
    await bot.reply(trigger.attachmentAction, {
      markdown: "An error occurred while fetching the connection stats. Please try again later.",
    });
  }
});



/* On mention with command
ex User enters @botname API, the bot will reply with the pie chart of API HTTP status code in the last 1 day
*/

framework.hears("API", async (bot, trigger) => {
  try {
      const last1days = 1 * 24 * 60 * 60;
      const response = await axios.get(`${merakiBaseUrl}/organizations/${orgId}/apiRequests/overview`, {
          headers: { 'X-Cisco-Meraki-API-Key': merakiApiKey },
          params: { timespan: last1days }
      });
  // console.log(response.data)
  const data = response.data;
      const responseCodeCounts = data.responseCodeCounts;

      // Prepare Data for the Chart, filtering out zero values
  const filteredData = Object.entries(responseCodeCounts).filter(([code, count]) => count > 0);

  // Separate the filtered data into labels and values
  const labels = filteredData.map(([code]) => code); // HTTP status codes
  const values = filteredData.map(([_, count]) => count); // Corresponding counts

  // console.log('Filtered Labels:', labels);
  // console.log('Filtered Values:', values);

      // Create Chart with QuickChart
      const chart = new QuickChart();
      chart
          .setConfig({
              type: 'pie',
              data: {
        labels: labels,
      datasets: [{
        data: values,
      }],
              },
              options: {
                  plugins: {
                      legend: { display: false },
          datalabels: {
          anchor: 'center', // Position the label inside
          align: 'center',  // Align the label inside
          formatter: (value, context) => {
            const labelsLocal = context.chart.data.labels || []; // Access labels directly from chart configuration
            const dataIndex = context.dataIndex;

            // console.log('Labels (local):', labelsLocal); // Debugging local labels
            // console.log('DataIndex:', dataIndex); // Debugging dataIndex

            const label = labelsLocal[dataIndex] || `Unknown (${dataIndex})`; // Fallback if label is undefined
            return `${label}: ${value}`;
          },
          color: '#000', // Label text color
          font: {
            size: 12, // Label font size
          },
          },
                  },
              },
          })
          .setWidth(800)
          .setHeight(600);

      const chartUrl = chart.getUrl();

      // Send Chart to Webex Space
      await bot.say({
          markdown: 'API Requests Overview:',
          attachments: [
              {
                  contentType: 'application/vnd.microsoft.card.adaptive',
                  content: {
                      type: 'AdaptiveCard',
                      body: [
                          {
                              type: 'Image',
                              url: chartUrl,
                          },
                      ],
                      version: '1.3',
                  },
              },
          ],
      });
      bot.say('Chart generated successfully!');
  } catch (error) {
      console.error('Error querying Meraki API:', error.message);
      bot.say('Failed to retrieve data from the Meraki API.');
  }
},


"**API**: (Return an overview of API requests data the last 1 day)",
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
      // console.log(`someone needs help! They asked ${trigger.text}`);
      bot
        .say(`Hello ${trigger.person.displayName}.`)
        //    .then(() => sendHelp(bot))
        .then(() => bot.say("markdown", framework.showHelp()))
        .catch((e) => console.error(`Problem in help hander: ${e.message}`));
    },
    "**help**: (what you are reading now)",
    0
  );


// say hello
framework.hears('hello', (bot, trigger) => {
  bot.say(`Hello ${trigger.person.displayName}.`)
  //    .then(() => sendHelp(bot))
  .then(() => bot.say("markdown", framework.showHelp()))
  .catch((e) => console.error(`Problem in help hander: ${e.message}`));
},
// "**help**: (what you are reading now)",
0
);

/*
// echo user input
framework.hears('echo', (bot, trigger) => {
  bot.say('markdown', `You said: ${trigger.prompt}`);
}, '**echo** - I\'ll echo back the rest of your message');
 */

// Its a good practice to handle unexpected input
// Setting a priority > 0 means this will be called only if nothing else matches
framework.hears(/.*/gim, (bot, trigger) => {
    bot.say('Sorry, I don\'t know how to respond to "%s"', trigger.message.text);
    bot.say('markdown', framework.showHelp());
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



