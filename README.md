# Meraki-Dashboard-Bot
Webex Bot to Retrieve Meraki Dashboard Data

This is a Webex Meraki-Bot.JS bot application project built using the [Webex-Bot-Starter](https://github.com/WebexSamples/webex-bot-starter) as a template and AI (ChatGPT) to work out the specific codes. It uses the [Webex-Node-Bot-Framework](https://github.com/WebexCommunity/webex-node-bot-framework) which simplifies developemnt for Webex bots.

This project is run using websocket instead of webhook which requires an inbound, internet reachable port for the Webex API to notify Framework of webhook events.  With websocket, this applications can be deployed behind firewalls and removes the requirement that webex bots and integrations must expose a public IP address to receive events.

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

Once the application is running (node Meraki-Bot.JS), you can interact with the bot either by adding it to a space & @botname or messaging to the bot directly

Image below show a direct interaction with the bot:
<img width="654" alt="image" src="https://github.com/user-attachments/assets/a3b9e714-d445-4247-ad6d-b9a8c1237825" />

Image below show interaction with the bot in a group space:
<img width="631" alt="image" src="https://github.com/user-attachments/assets/df92bb1b-e7be-4cf7-bf12-bb93a6fdb8f7" />

The bot will response with data return from the API in statistics/value format or it can also be presented in a chart format where applicable.

Image below is an example of a response in chart format where is shows the Api requests overview in the last 1 day:
<img width="452" alt="image" src="https://github.com/user-attachments/assets/c13dc122-58d0-4f6e-8528-b49e3215f369" />


# How to update or expand the code

The project is written in blocks of code for each of the API calls.  Depending on the use cases and the availability of the Meraki Dashboard API, each block can be duplicated and updated with the new API OR deleted if not needed.
<img width="1040" alt="image" src="https://github.com/user-attachments/assets/ff1e60b5-24be-4170-b011-73f058b5c1a8" />

One of the propose of this project is to provide a reference code for anyone to use and build on depending on their use cases and requirements.  

This project is created with the help of AI (ChatGPT).  For someone not skilled in coding, you can use AI (ChatGPT) to help you but some level of troubleshooting will be needed as AI (ChatGPT) may not provide an errorless code.

As an example, you can ask AI (CHatGPT) "Can you provide the code using Webex-Node-Bot-Framework for a Webex Bot to return the result from Meraki Dashboard API https://developer.cisco.com/meraki/api-v1/get-organization-summary-top-appliances-by-utilization/"

OR you can also copy a block of the code in Meraki-Bot.JS and ask AI (ChatGPT) to update it using another Meraki Dashboard API.

# How to Limit Bot Access to Specific Spaces or Users

By default, when a bot is created, anyone can interact with with it or add it to a space if the organisation does not restrict Webex Messaging to within the organisation.  Even if Webex Messaging interaction is restriction to within the organisation, anyone in the organisation can also interaction with it.  

**Restricted_Bot.js** is a sample code where spaces and users that can interact with the code is listed in the code.  The bot will be automatically removed from space not listed if it is being added to it.  Users not listed will not be able to interact with the bot directly. 


# Disclaimer
This script is NOT guaranteed to be bug free and production quality.





