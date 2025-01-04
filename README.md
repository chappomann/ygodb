# ygodb
To track your personal ygo collection. All we're doing is hitting the ygoprodeck API and displaying a page with our count and associated details I found at some point important.

last updated 1/3

How To Run Locally:
- npm i
- npm run generate:local-database
- npm run generate:local-images
- npm run dev
- go to: [localhost:3000](http://localhost:3000/)

Current Features:
- Ability to create a fresh JSON based on ygoprodeck
- Ability to pull images from ygoprodeck
- Added ebay/tcg trader Pricing

Upcomming Features:
- Bulk uploads/updates
- Pricing
- Loading spinner during filtering and sorting processes
- Logging and Error Handling
- Logins for multiple users to hold their collection
- Filtering that actually works

Defects:
   - Cards
        - God Cards do not link to the proper Yugipedia links
        - Blue-Eyes White Dragon is shown as an Effect monster
    - Filtering
        - Types and then by Stars: currently stars does not take into consideraiton the types

Notes:

- Those of us running in linux, here's a good resource on [how to utilize screen](https://stackoverflow.com/questions/24706815/how-do-i-pass-a-command-to-a-screen-session).