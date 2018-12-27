export default [
  {
    message: 'convertToJSON',
    func: (csv) => {
      const rows = csv.split('\n'),
        headers = rows.splice(0, 1)[0].split(','),
        json = [];

      rows.forEach(row => {
        const obj = {};
        const cols = row.split(',');
        headers.forEach((header, j) => {
          obj[header] = cols[j];
        });
        json.push(obj);
      });
      return json;
    }
  },
  {
    /**
     * Pass all match array and get data as each season as key with match data as value
     */
    message: 'getDataBySeasons',
    func: (matchData) => {
      const seasons = {};
      matchData.forEach(row => {
        if (seasons[row.Season_Id]) {
          seasons[row.Season_Id].push(row);
        } else {
          seasons[row.Season_Id] = [row];
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
     * Pass a particular season data array and get data as each venue as key with match data as value
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