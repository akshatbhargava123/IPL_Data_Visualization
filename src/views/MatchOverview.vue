<template>
  <el-card shadow="always" id="focusedElem">
    <h1>Match {{ match.Match_Id }}</h1>
    <p>{{ match.Match_Date | PlainDate }}</p>
    <div class="same-line">
      <h3 :class="match.Team_Name_Id == match.Match_Winner_Id  ? 'winner' : 'loser'">Team_Name_{{ match.Match_Winner_Id == match.Opponent_Team_Id ? match.Opponent_Team_Id : match.Team_Name_Id }}</h3>
      <span>
        {{
          (matchDetails[1].teamId == match.Team_Name_Id ?
              `${matchDetails[1].runs} / ${matchDetails[1].totalOuts} (${matchDetails[1].overs.length} o)`:
              `${matchDetails[2].runs} / ${matchDetails[2].totalOuts} (${matchDetails[2].overs.length} o)`)
        }}
      </span>
    </div>
    VS
    <div class="same-line">
      <h3 :class="match.Team_Name_Id == match.Match_Winner_Id  ? 'winner' : 'loser'">Team_Name_{{ match.Match_Winner_Id == match.Opponent_Team_Id ? match.Team_Name_Id : match.Opponent_Team_Id }}</h3>
      <span>
        {{
          (matchDetails[2].teamId == match.Team_Name_Id ?
              `${matchDetails[1].runs} / ${matchDetails[1].totalOuts} (${matchDetails[1].overs.length} o)`:
              `${matchDetails[2].runs} / ${matchDetails[2].totalOuts} (${matchDetails[2].overs.length} o)`)
        }}
      </span>
    </div>
    
      <!-- VS
    <h3>Team_Name_{{ match.Match_Winner_Id == match.Opponent_Team_Id ? match.Team_Name_Id : match.Opponent_Team_Id }}</h3> -->
    <!-- <p>Total Matches: <b>{{ season.matches ? season.matches.length : '' }}</b></p> -->
    <Loading v-if="loading" />
  </el-card>
</template>

<script>
import localforage from "localforage";

import BarChart from "@/components/BarChart";
import Loading from "@/components/Loading";

import store from "../sharedservice";
import { getColor, getColors, getLightColors } from "../utils";

export default {
  name: "MatchOverview",
  components: {
    Loading,
    BarChart
  },
  data() {
    return {
      match: {},
      matchDetails: {},
      loading: true
    };
  },
  async mounted() {
    this.match = this.$route.params.match;
    this.matchDetails = this.$route.params.matchDetails;

    console.log('match', this.match);
    console.log('matchDetails', this.matchDetails);

    // document.getElementById("focusedElem").scrollIntoView();


    this.loading = false;
  }
};
</script>

<style scoped>
.same-line {
  margin: 10px;
}
.same-line h3 { 
  display: inline;
}
.same-line span { 
  float: none;
  margin-left: 8px;
}
</style>