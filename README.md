Use this tool for smart search/download/delete ability in Salesforce logs,
Create and modified TraceFlags/debugLevel and more.
No installation needed.
You can use our public heroku base app (https://salesforce-debugtool.herokuapp.com) for daily use or clone and deploy your on.
This tool is client base and the server is needed only to serve the angular,
All api calls made from the browser using the angular http library.
No transmission takes place in the server.

*** In order to enable using the tool in your ORG go to Setup > Cors , click new and add the tool url. ***

Steps to follow if you choosed to deploy your on version:
1. create a connected app in your org and set the callback URL to your server path.
2. modifay the authorization.component.ts file with your on client_id (Consumer Key) connected app

