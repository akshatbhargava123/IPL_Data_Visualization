<template>
  <el-card shadow="always" id="focusedElem">
    <h1>Season {{ id }}</h1>
    <p>{{ `${season.startDate}|${season.endDate}` | ToFromDate }}</p>
    <p>Total Matches: <b>{{ season.matches ? season.matches.length : '' }}</b></p>
    <p>Total Teams Participated: <b>{{ dataByTeams.length }}</b></p>
    <p>No. of Matches won per team:</p>
    <el-row justify="center">
      <el-col :span="16" :offset="4">
        <div class="chart">
          <bar-chart
            type="horizontalBar"
            :dataProp="teamsByWinsChart.data"
            :options="teamsByWinsChart.options"
            xStepSize="1"
          ></bar-chart>
        </div>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>

    <hr />
    <h3>Venues / Stadiums in the Season</h3>
    <venue-select :dataByVenues="dataByVenues"></venue-select>

    <hr />
    <h3>Match Results of the Season</h3>
    <matches-detail-table :matches="season.matches"></matches-detail-table>
    
  </el-card>
</template>

<script>
import Ball_by_Ball from "@/assets/Ball_by_Ball.csv";

import BarChart from "@/components/BarChart";
import VenueSelect from "@/components/VenueSelect";
import MatchesDetailTable from "@/components/MatchesDetailTable";

import store, { WORKER_KEY, STORE_KEYS } from "../sharedservice";
import { getColors, getLightColors } from "../utils";

export default {
  name: "SeasonOverview",
  components: {
    BarChart,
    VenueSelect,
    MatchesDetailTable
  },
  data() {
    return {
      id: null,
      season: [],
      dataByTeams: [],
      dataByVenues: [],
      teamsByWinsData: {},
      teamsByWinsChart: {
        options: {
          legend: {
            display: false
          }
        },
        data: {
          labels: [],
          datasets: []
        }
      }
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.season = this.$route.params.season;

    document.getElementById("focusedElem").scrollIntoView();

    const worker = store.getItem(STORE_KEYS.WORKER);

    worker
      .postMessage("getDataByTeams", [this.season.matches])
      .then(dataByTeams => {
        // set data by teams of this particular season
        store.setItem(STORE_KEYS.SEASON_DATA_BY_TEAM, dataByTeams, this.id);

        // prepare data for num match wins
        const teamNames = [];
        const winningMatches = [];
        const teamKeys = Object.keys(dataByTeams);
        teamKeys.forEach(key => {
          const matches = dataByTeams[key];
          const matchesWinning = matches.filter(m => m.Match_Winner_Id == key);

          teamNames.push(`Team_Name_${key}`);
          winningMatches.push(matchesWinning.length);
          this.dataByTeams.push(dataByTeams[key]);
        });

        // update num of match wins chart
        this.teamsByWinsChart.data = {
          labels: teamNames,
          datasets: [
            {
              data: winningMatches,
              label: "No of wins",
              borderWidth: 1,
              backgroundColor: getColors(winningMatches.length),
              borderColor: getLightColors(winningMatches.length)
            }
          ]
        };

        // console.log(dataByTeams);
        // console.log(ballByBallJSON);

        worker
          .postMessage("convertToJSON", [Ball_by_Ball])
          .then(ballByBallJSON => {
            this.season.matches.forEach(match => {
              worker
                .postMessage("calculateNetRunRateOfTeamInMatch", [
                  match.Match_Id,
                  match.Team_Name_Id,
                  ballByBallJSON
                ])
                .then(runrate => {
                  console.log(match.Match_Id, match.Team_Name_Id, runrate);
                });
            });
          });

        //   teamKeys.forEach(key => {
        //   const matchesPlayed = dataByTeams[1].map(d => d.Match_Id);
        //   console.log(matchesPlayed)

        //   matchesPlayed.forEach(matchId => {
        //     worker.postMessage(
        //       'calculateNetRunRateOfTeamInMatch',
        //       [matchId, 1, ballByBallJSON]
        //     ).then(runrate => {
        //       console.log(`teamId: ${1} - matchId: ${matchId} - runRate: ${runrate}`);
        //     });

        //   // })
        // });

        worker
          .postMessage("getDataByVenues", [this.season.matches])
          .then(dataByVenues => {
            console.log(dataByVenues);
            const venueKeys = Object.keys(dataByVenues);

            venueKeys.forEach(key => {
              this.dataByVenues.push(dataByVenues[key]);
            });
          });
      });
  }
};
</script>

<style scoped>
.el-card {
  min-height: 1200px;
}
</style>

