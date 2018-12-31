<template>
  <el-card shadow="always" id="focusedEl">
    <Loading v-if="loading" />
    <div v-else>
      <h1>{{ venueMatches[0].Venue_Name }}</h1>
      <p>{{ venueMatches[0].City_Name + ', ' + venueMatches[0].Host_Country }}</p>
      <p>Season: <b>{{ venueMatches[0].Season_Id }}</b></p>
      <p>Total Matches: <b>{{ venueMatches ? venueMatches.length : 0 }}</b></p>
      <p>{{ `${venueMatches[0].Match_Date}|${venueMatches[venueMatches.length - 1].Match_Date}` | ToFromDate }}</p>

      <el-row>
        <el-col :span="12" :offset="6">
          <line-chart
            type="pie"
            :dataProp="matchesWonByChart.data"
            :options="matchesWonByChart.options"
          ></line-chart>
        </el-col>
      </el-row>

      <br />
      <hr />
      <h3>Match Results in the Venue (for this season):</h3>
      <matches-detail-table
        :matches="venueMatches"
        :matchesDetail="fullMatchesDetail"
        @matchSelect="navigateToMatchOverview"
      ></matches-detail-table>
    </div>
  </el-card>
</template>

<script>
import localforage from "localforage";

import MatchesDetailTable from "@/components/MatchesDetailTable";
import LineChart from "@/components/LineChart";
import Loading from "@/components/Loading";
import { getColor } from '../utils';

export default {
  name: "VenueOverview",
  components: {
    Loading,
    LineChart,
    MatchesDetailTable
  },
  data() {
    return {
      venueMatches: [],
      matchesDetail: [],
      fullMatchesDetail: {},
      matchesWonType: {
        bat: 0,
        ball: 0
      },
      matchesWonByChart: {
        data: {},
        options: { responsive: true }
      },
      loading: true
    };
  },
  async mounted() {

    document.getElementById('focusedEl').scrollIntoView();

    this.venueMatches =
      this.$route.params.venueMatches ||
      (await localforage.getItem("venueMatches"));
    this.matchesDetail =
      this.$route.params.matchesDetail ||
      (await localforage.getItem("venueMatchesDetail"));
    this.fullMatchesDetail =
        this.$route.params.fullMatchesDetail ||
      (await localforage.getItem("fullMatchesDetail"));

    this.venueMatches.forEach(match => {
      if (match.Toss_Winner_Id == match.Match_Winner_Id) {
        this.matchesWonType[match.Toss_Decision == "bat" ? "bat" : "ball"]++;
      } else {
        this.matchesWonType[match.Toss_Decision == "bat" ? "ball" : "bat"]++;
      }
    });

    this.matchesWonByChart.data = {
      labels: ["Matches won - Batting first ", "Matches won - Bowling first"],
      datasets: [
        {
          fill: true,
          backgroundColor: [getColor(5).color, getColor(6).color],
          data: [this.matchesWonType['bat'], this.matchesWonType['ball']],
          borderColor: [getColor(5).lightColor, getColor(6).lightColor],
          borderWidth: [2, 2]
        },
      ]
    };

    this.loading = false && false;
  },
  methods: {
    async navigateToMatchOverview({ match }) {

      await localforage.setItem('match', match);
      await localforage.setItem('matchDetails', this.fullMatchesDetail[match.Match_Id]);
      await localforage.removeItem('matchNum');

      this.$router.push({
        name: "match-overview",
        params: {
          match,
          matchDetails: this.fullMatchesDetail[match.Match_Id]
        }
      });
    },
  }
};
</script>

<style scoped>
.el-card {
  min-height: 1200px;
}
</style>