export default [
  {
    message: 'convertToJSON',
    func: (csv) => {
      /**
       * Converts CSV into JSON
       */
      const rows = csv.split(/\n|\r\n/),
        headers = rows.splice(0, 1)[0].split(','),
        json = [];

      for (let i = 0; i < rows.length; i++) {
        const obj = {};
        const cols = rows[i].match(/("([^"]*)"|[^,]*)(,|$)/g);
        if (!cols) continue;

        headers.forEach((header, j) => {
          if (!cols[j]) return;
          if (header[0] == '"' || header[header.length - 1] == `"`)
            header = header.slice(1, header.length - 1);
          obj[header] = cols[j] == ' ,' ? undefined : cols[j].slice(0, cols[j].length - 1);
        });
        json.push(obj);
      }

      delete json[json.length - 1];

      return json;
    }
  },
  {
    /**
     * Pass matches data array and get data sorted by each season with additional data for season like start and end date
     */
    message: 'getDataBySeasons',
    func: (matchData) => {
      const seasons = {};
      matchData.forEach(row => {
        const currentMatchDate = new Date(row.Match_Date);
        let currentSeason = seasons[row.Season_Id];
        if (currentSeason) {
          currentSeason.matches.push(row);
          if (currentMatchDate < currentSeason.startDate) {
            currentSeason.endDate = currentSeason.startDate;
            currentSeason.startDate = currentMatchDate;
          } else if (currentMatchDate > currentSeason.startDate) {
            if (!currentSeason.endDate || currentMatchDate > currentSeason.endDate) {
              currentSeason.endDate = currentMatchDate;
            }
          }
          currentSeason.startDate
        } else {
          seasons[row.Season_Id] = {
            matches: [row],
            startDate: new Date(row.Match_Date),
            endDate: null
          };
        }
      });
      delete seasons['undefined'];
      return seasons;
    }
  },
  {
    /**
     * Pass a particular season data array and get data as each venue as key with match data as value
     */
    message: 'getDataByTeams',
    func: (seasonData) => {
      const teams = {};
      seasonData.forEach(row => {
        if (teams[row.Team_Name_Id]) {
          teams[row.Team_Name_Id].push(row);
        } else {
          teams[row.Team_Name_Id] = [row];
        }
      });
      delete teams['undefined'];
      return teams;
    }
  },
  {
    /**
     * Pass a particular season data array and get data as each venue as key with array of match data as value
     */
    message: 'getDataByVenues',
    func: (seasonData) => {
      const venues = {};
      seasonData.forEach(row => {
        if (venues[row.Venue_Name]) {
          venues[row.Venue_Name].push(row);
        } else {
          venues[row.Venue_Name] = [row];
        }
      });
      delete venues['undefined'];
      return venues;
    }
  },
  {
    /**
     * Will take a matchId, Team_Name_Id and Ball_by_Ball data JSON and return net runrate of that team across match
     */
    message: 'getMatchDetails',
    func: (ballByBallData) => {
      // Don't use filter here to filter out matches, it would cost us another full iteration of data
      /**
       * object with key as matchId
       */
      // let details = {
      //   [matchId]: {
      // 1: {
      //   sixes: 0,
      //   fours: 0,
      //   legByes: 0,
      //   wides: 0,
      //   runs: 0,
      //   overs: [{ overId: 1, sixes: 1, fours: 1, legByes: 1, wides: 1, runRate }]
      // },
      //     2: {}
      //   }
      // }
      let details = {};
      ballByBallData.forEach(ball => {

        const {
          Match_Id,
          Innings_Id,
          Over_Id,
          Batsman_Scored,
          Extra_Runs,
          Extra_Type
        } = ball;

        /**
         *  Extra innings matches are not handled since 
         *  I don't have enough knowledge of cricket and couldn't 
         *  find anything relevant regarding this online, we assume the match to
         *  get over after two innings.
         **/
        if (Innings_Id > 2) return;

        // If null yet, initialise it.
        if (!details[Match_Id]) {
          details[Match_Id] = {
            "1": {
              balls: 0,
              sixes: 0,
              fours: 0,
              legByes: 0,
              wides: 0,
              runs: 0,
              extraRuns: 0,
              overs: [],
            },
            "2": {
              balls: 0,
              sixes: 0,
              fours: 0,
              legByes: 0,
              wides: 0,
              runs: 0,
              extraRuns: 0,
              overs: []
            }
          }
        }

        const currentInnData = details[Match_Id][Innings_Id];

        if (!currentInnData.overs.length || currentInnData.overs.length <= Number(Over_Id) - 1) {
          if (currentInnData.overs.length) {
            const lastOver = currentInnData.overs[currentInnData.overs.length - 1];
            lastOver.runRate = (lastOver.runs / 6).toFixed(4);
          }
          currentInnData.overs.push({
            overdId: Over_Id,
            sixes: Number(Batsman_Scored == 6),
            fours: Number(Batsman_Scored == 4),
            legByes: Number(Extra_Type == "legbyes"),
            wides: Number(Extra_Type == "wides"),
            extraRuns: Number(Extra_Type ? Extra_Runs : 0),
            runs: Number(Batsman_Scored) + (Extra_Type ? Number(Extra_Runs) : 0),
          });
        } else {
          const overDetails = currentInnData.overs[currentInnData.overs.length - 1];
          overDetails.sixes += Number(Batsman_Scored == 6);
          overDetails.fours += Number(Batsman_Scored == 4);
          overDetails.legByes += Number(Extra_Type == "legbyes");
          overDetails.wides += Number(Extra_Type == "wides");
          overDetails.extraRuns += Number(Extra_Type ? Extra_Runs : 0);
          overDetails.runs += Number(Batsman_Scored) + Number(Extra_Type ? Extra_Runs : 0);
        }
        
        currentInnData.balls++;
        currentInnData.sixes += Number(Batsman_Scored == 6);
        currentInnData.fours += Number(Batsman_Scored == 4);
        currentInnData.legByes += Number(Extra_Type == "legbyes");
        currentInnData.wides += Number(Extra_Type == "wides");
        currentInnData.extraRuns += Number(Extra_Type ? Extra_Runs : 0);
        currentInnData.runs += Number(Batsman_Scored) + Number(Extra_Type ? Extra_Runs : 0);

        // If last over, calculate overall innining run rate
        if (Over_Id == 20) {
          currentInnData.runRate = (currentInnData.runs / 6).toFixed(4);
        }

      });
      return details;
    }
  },
  {
    message: 'getMatchesInVenue',
    func: (seasonData) => {
      const venues = new Set();
      seasonData.forEach(d => {
        venues.add(d.Venue_Name);
      });
      return new Array(venues);
    }
  }
];