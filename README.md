# ThatWordGame
ThatWordGame done by team 4 for the Security LevelUp

Main website: https://tomsportfolio.co.za/home/
ID server: https://www.id.tomsportfolio.co.za/

Note: QA is currently the main branch so clone that one
Tip: Running both servers locally is a pain. We recommend running the webapp locally and leaving the ID one online.

## ID server
The id server is its own branch called `feature_identityServer`. If you want to run everything locally this branch needs to be cloned and run seperately with `npm run devStartAuth`. This kinda sucks so we recommend playing with it alone and then just using the internet one.

You will require an instance of sqlserver-ex and the scripts needed are in the Database folder. The database must be in sql login mode.

You'll need a `.env` in the root directory containing:
```
RDS_HOSTNAME=youdburl
RDS_PORT=yourdbport
RDS_USERNAME=yourusername
RDS_PASSWORD=yourpassword
NODE_ENV=development
PORT=just must be different to the webapp if both local
REFRESH_TOKEN=*
ACCESS_TOKEN=*
```
To get the refresh and access token:
1. Open up a terminal
2. Type Node and hit Enter
3. run this command 'require('crypto').randomBytes(64).toString('hex')'

Generate a new hex string for each variable (just run the command twice..)

Install packages with `npm install`.

## Webapp
This app uses Google and Github Oath and has some required evironment variables. This also needs a sqlserver-ex db to connect to. The scripts are in the db folder.
### Google
Follow [this](https://support.google.com/cloud/answer/6158849?hl=en) guide on how to create a Google Oath app. For the `Authorised Javascript Origins` field put `http://localhost:5000`. For `Authorised Redirect URIs` put `http://localhost:5000/auth/oauth2/redirect/google`. Following this will leave you with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Feel free just to contact a member of the team for the secrets directly if you want.
### Github
Follow [this](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) guide on how to create a Github Oath app. Set the `Homepage URL` to `http://localhost:5000` and set the `Authorization Callback URL` to `http://localhost:5000/auth/oauth2/redirect/github`. Grab the client id and secret after finishing. Feel free to contact us directly instead.

You will need the following environment variables, stored in a .env file:
```
RDS_HOSTNAME=youdburl
RDS_PORT=yourdbport
RDS_USERNAME=yourusername
RDS_PASSWORD=yourpassword
NODE_ENV=development
PORT=must be different to id server
GOOGLE_CLIENT_ID=*
GOOGLE_CLIENT_SECRET=*
GITHUB_CLIENT_ID=*
GITHUB_CLIENT_SECRET=*
ID_SERVER_URI=https://id.tomsportfolio.co.za/ (or local url if running id server locally)
ID_SERVER_VALID=valid
```

The server can be started with `npm start`.