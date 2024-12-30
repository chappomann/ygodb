# ygodb
to track my personal ygo collection

last updated 12/30 

How To:
- npm i
- npm run dev
- go to: [localhost:3000](http://localhost:3000/)
- you will see all of LA's current cards. can add, filter and view them from [Yugipedia](https://wwww.yugipedia.com/)
- to start over, remove entries from Yugioh.json and start fresh
    - suggested: when adding a new record, just import the password. (much easier when starting out)

Todo:

Features:
- Bulk uploads/updates
- Pricing
- Loading spinner during filtering and sorting processes
- Logging and Error Handling
- Logins for multiple users to hold their collection

Defects:
   - Cards
        - God Cards do not link to the proper Yugipedia links
        - Blue-Eyes White Dragon is shown as an Effect monster
    - Filtering
        - Types and then by Stars: currently stars does not take into consideraiton the types

Notes:

- Those of us running in linux, here's a good resource on [how to utilize screen](https://stackoverflow.com/questions/24706815/how-do-i-pass-a-command-to-a-screen-session).