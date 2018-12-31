# IPL_Data_Visualization (SocialCops Interview Assignment)
Data Visualization of IPL data using two datasets (Ball_by_Ball and Matches) provided by [Kaggle User - harsha547](https://kaggle.com/harsha547/indian-premier-league-csv-dataset).

The dashboard currently has following features:
1. Seasons (provides overview of each season data available in the dataset)
2. SeasonOverview (actually detailed, provides different visualizations for the season including total matches in the season, Net Run Rate of each match, total venues involved, etc.)
3. VenueOverview (provides specific info regarding a venue in selected season like average runs in innings, matches, highest scored match, etc.)
4. MatchOverview (provides information regarding a match from basic to advanced like match winner, type of extra runs received and conceded by either team, etc.)

Click [here](https://ipl-data-visualization.firebaseapp.com) to checkout the hosted app.

## Technology Stack
1. VueJS (core frontend framework). Reasons to choose:
  * Out of the box lot of functionality (routing, data-binding and what not.)
  * Bonus Points 😛

2. ChartJS for rendering charts. Reason(s) to choose:
  * I already had experience with it before starting the project
  * It fulfills the exact need of the project and is lightweight as compared to other solutions.

3. Element UI for UI components, Reason(s) to choose:
  * I was exploring different options like vuetify but they felt too heavy compared to project's need, this one looks minimilistic.

4. LocalForage as storage API library, Reason(s) to choose:
  * Handled all my complex get/set works in IndexedDB
  * Naturally drops to another db (WebSQL, localstorage) if IndexedDB not available

5. Firebase for hosting (core app and CSVs)
  * Easiest and fastest hosting solution in my opinion.

## Bonus Points T&C (given vs fullfilled)
* You create the webapp in VueJS ✅ (tried to make code as modular as possible using component based architecture using VueJS)
* You can optimize the loading time ✅ (optimized loading time by caching the stuff in IndexedDB using localforage so we don't make fetch requests every time to get CSVs)
* You make it mobile responsive  ❌
* You make it a PWA ⚠️ (partially done, updated manifest file but couldn't get prompt for add to homescreen, I didn't get custom service worker working in this project)
* You make it offline usable ❌

## What I think can be added using the datasets provided but didn't implement?
1. Player Partnerships' table in sorted order
2. Batting and Bowling stats of team (in particular season, match, venue)
3. Github type contribution chart for showing a match's ball by ball detail

## How to run?
```
npm install
npm run serve
```

## Some Handwritten planning before starting the project 👀
![alt image1](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/4.jpeg?alt=media&token=e22ea8e3-bc07-4080-bfcc-d56b67f855b9)
![alt image2](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/5.jpeg?alt=media&token=e435e488-9535-421d-8fbc-3568c40964f3)
![alt image3](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/1.jpeg?alt=media&token=fb71e33d-4ad3-41dc-9f46-aa88edf56ea0)
![alt image4](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/2.jpeg?alt=media&token=650b4e6b-b964-4c55-96c6-1227b5c6c2d3)
![alt image5](https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/3.jpeg?alt=media&token=deeb70f7-9635-483e-8c91-0ad4df3206ce)
