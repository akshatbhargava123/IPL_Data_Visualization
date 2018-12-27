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
        const cols = rows[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!cols) continue;

        headers.forEach((header, j) => {
          if (header[0] == '"' || header[header.length - 1] == `"`)
            header = header.slice(1, header.length - 1);
          obj[header] = cols[j];
        });
        json.push(obj);
      }

      return json;
    }
  },
  {
    /**
     * Pass matches data array and get data sorted by each season with additional data for season like start and end date
     */
    message: 'getDataBySeasons',
    func: (matchData) => {
      const seasons = { };
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
    message: 'calculateNetRunRateOfTeamInMatch',
    func: (matchId, teamNameId, ballByBallData) => {
      let balls = 0, runs = 0;
      ballByBallData.forEach(d => {
        if (d.Match_Id == matchId && d.Team_Batting_Id == teamNameId) {
          balls++;
          runs += Number(d.Batsman_Scored) + Number(d.Extra_Runs);
        }
      });
      return runs / balls;
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