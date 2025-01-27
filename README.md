# Meraki-Bot
Webex Bot to Retrieve Meraki Dashboard Data

This is a Webex Meraki-Bot.JS bot application project built using the [Webex-Bot-Starter](https://github.com/WebexSamples/webex-bot-starter) as a template and AI (ChatGPT) to work out the specific codes. It uses the [Webex-Node-Bot-Framework](https://github.com/WebexCommunity/webex-node-bot-framework) which simplifies developemnt for Webex bots.

# Overview

This bot application uses the API from [Meraki Dashboard API](https://developer.cisco.com/meraki/api-v1/).

Install [Webex-Node-Bot-Framework](https://github.com/WebexCommunity/webex-node-bot-framework) following the installation steps in it.  

Additional modules will need to be install to run Meraji-Bot.JS:

 - npm install axios
 - npm install quickchart-js
 - npm install adaptivecards-templating

To run the application you will need to update the Meraki-Bot.JS with the following:

 1. **orgId** - The specific Meraki Org ID that you are running the queries on.
 2. **merakiApiKey** - This is the Meraki Administrator API key. This API key will be associated with the dashboard administrator account which generates it and will inherit the same permissions as that account. Use a Read-Only administrator API key if you do not want the bot to execute any changes to your Meraki Org
 3. **token** - This is the Bot token for the [Webex Bot](https://developer.webex.com/docs/bots)

Once the application is running (node Meraki-Bot.JS), you can interact with the bot either by adding it to a space or messaging to the bot directly

Image below show a direct interaction with the bot:
<img width="654" alt="image" src="https://github.com/user-attachments/assets/a3b9e714-d445-4247-ad6d-b9a8c1237825" />

Image below show interaction with the bot in a group space:
<img width="631" alt="image" src="https://github.com/user-attachments/assets/df92bb1b-e7be-4cf7-bf12-bb93a6fdb8f7" />





# Disclaimer
This script is NOT guaranteed to be bug free and production quality.





