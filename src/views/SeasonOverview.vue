<template>
  <el-card shadow="always">
    <h1>Season {{ id }}</h1>
    <p>Total Matches: <b>{{ season.length }}</b></p>
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
  </el-card>
</template>

<script>
import Ball_by_Ball from "@/assets/Ball_by_Ball.csv";

import BarChart from "@/components/BarChart";

import store, { WORKER_KEY, STORE_KEYS } from "../sharedservice";
import { getColors, getLightColors } from "../utils";

export default {
  name: "SeasonOverview",
  components: { BarChart },
  data() {
    return {
      id: null,
      season: [],
      dataByTeams: [],
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

    const worker = store.getItem(STORE_KEYS.WORKER);

    worker.postMessage("getDataByTeams", [this.season]).then(dataByTeams => {

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

      // teamKeys.forEach(key => {
      // const matchesPlayed = dataByTeams[1].map(d => d.Match_Id);
      // console.log(matchesPlayed)

      // matchesPlayed.forEach(matchId => {
      //   worker.postMessage(
      //     'calculateRunRateOfTeamAcrossSeason',
      //     [matchId, 1, ballByBallJSON]
      //   ).then(runrate => {
      //     console.log(`teamId: ${1} - matchId: ${matchId} - runRate: ${runrate}`);
      //   });

      // })
    });
  }
};
</script>

<style scoped>
</style>

