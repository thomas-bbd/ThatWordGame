# ThatWordGame
ThatWordGame done by team 4 for the Security LevelUp


--
# How To Start The ID Server
Once you have opened up the project folder ->

1. Set Up The DB
-> In the /Database folder there is a script IdentityDB.sql to run in order to create the USER table

2.Set the environment variables as below:
-> SERVER NAME (e.g. NAME/SQLEXPRESS ) => RDS_HOSTNAME=*
RDS_USERNAME=*
RDS_PASSWORD=*
RDS_PORT=* (1433 IN MOST CASES)

3. Set the Access and Refresh Tokens Secrets for the JWT

To Do This:
1. Open up a terminal
2. Type Node and hit Enter
3. run this command 'require('crypto').randomBytes(64).toString('hex')'

This will return a random hex string used to sign and verify the JWT
Generate a new hex string for each variable (just run the command twice..)
REFRESH_TOKEN=*
ACCESS_TOKEN=*

3. Run 'npm i' to install the required packaged

4. Start the server by runnin npm run devStartAuth