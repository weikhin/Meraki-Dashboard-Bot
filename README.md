# Meraki-Bot
Webex Bot to Retrieve Meraki Dashboard Data

This is a Webex Meraki-Bot.JS bot application that I have built using the [Webex-Bot-Starter](https://github.com/WebexSamples/webex-bot-starter) as a template. It uses the [Webex-Node-Bot-Framework](https://github.com/WebexCommunity/webex-node-bot-framework) which simplifies developemnt for Webex bots.

# Overview

This bot application uses the API from [Meraki Dashboard API](https://developer.cisco.com/meraki/api-v1/) for the bot to provide response to the data requested.

To run the application you will need to update the Meraki-Bot.JS with the following:

 1. orgId - The specific Meraki Org ID that you are running the queries on.
 2. merakiApiKey - This is the Meraki Administrator API key. This API key will be associated with the dashboard administrator account which generates it and will inherit the same permissions as that account. Use a Read-Only administrator API key if you do not want the bot to execute any changes to your Meraki Org
 3. token - This is the Bot token for the [Webex Bot](https://developer.webex.com/docs/bots)



# Disclaimer
This script is NOT guaranteed to be bug free and production quality.





