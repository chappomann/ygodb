# ygodb
to track my personal ygo collection\

last updated 12/30 

How To:
- npm i
- npm run dev
- go to: [localhost:3000](http://localhost:3000/)
- you will see all of LA's current cards. can add, filter and view them from [Yugipedia](https://wwww.yugipedia.com/)
- to start over, remove entries from Yugioh.json and start fresh
-- suggested: when adding a new record, just import the password. (much easier when starting out)

Todo:
Features:
- Bulk uploads/updates
- Pricing
- Loading spinner during filtering and sorting processes
- Logging and Error Handling
- Logins for multiple users to hold their collection
- Defects:
    - Cards
        - God Cards do not link to the proper Yugipedia links
        - Blue-Eyes White Dragon is shown as an Effect monster
    - Filtering:
        - Types and then by Stars - currently stars does not take into consideraiton the types

Notes:

[How To Screen](https://stackoverflow.com/questions/24706815/how-do-i-pass-a-command-to-a-screen-session):

It is as simple as this: 
```
screen -md node server.js
```
This requires the command to run as a service (as it does), otherwise the screen stops immediately.

To optionally also set a name for the session (e.g. "session-name"): 
```
screen -mdS session-name node server.js

```
You can then attach to the screen with: 
```
screen -rd session-name
```
If you want to redirect all output to a file, you can do like this: 
```
screen -mdS session-name bash -c 'node server.js &> output.log'
```
You can then monitor the output with e.g.: 
```
tail -f output.log
```

You can list your running screens with: 
```
screen -ls
```
or 
```
screen -list
```