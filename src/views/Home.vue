<template>
  <Loading v-if="dataLoading" />
  <SeasonSelect v-else :dataBySeasons="dataBySeasons" @seasonClick="seasonSelected" />
</template>

<script>
import localforage from "localforage";

import SeasonSelect from "@/components/SeasonSelect.vue";
import Loading from "@/components/Loading.vue";

import store from "../sharedservice";

let Match, Ball_by_Ball;

export default {
  name: "home",
  components: {
    SeasonSelect,
    Loading
  },
  data() {
    return {
      matchesData: null,
      worker: null,
      dataBySeasons: null,
      dataLoading: true
    };
  },
  async created() {
    this.worker = store.getItem('worker');
    localforage.setDriver(localforage.INDEXEDDB);

    // Eagerly loading CSV files for better experience later

    Match = await localforage.getItem('Match_Data')
    Ball_by_Ball = await localforage.getItem('Ball_by_Ball_Data')

    if (!Match) {
      await fetch('https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/Match.csv?alt=media&token=200ae91e-9634-4b8c-8277-a581a699e15b', { mode: 'no-cors' })
        .then(res => res.text())
        .then(res => Match = res)
        .catch(err => alert('Some error occured, please reload the page.'));
    }
    
    if (!Ball_by_Ball) {
      await fetch('https://firebasestorage.googleapis.com/v0/b/test-1522465624044.appspot.com/o/Ball_by_Ball.csv?alt=media&token=cc1bff3d-e7d5-40a9-b209-48de62180b0e', { mode: 'no-cors' })
        .then(res => res.text())
        .then(res => Ball_by_Ball = res)
        .catch(err => alert('Some error occured, please reload the page.'));
    }

    localforage.setItem('Match_Data', Match)
    localforage.setItem('Ball_by_Ball_Data', Ball_by_Ball)

    const Matches_JSON = await localforage.getItem("Matches_JSON");
    if (Matches_JSON) {
      Promise.resolve(Matches_JSON).then(this.MatchJSONReady);
    } else {
      this.worker
        .postMessage("convertToJSON", [Match])
        .then(this.MatchJSONReady);
    }
  },
  methods: {
    async seasonSelected(seasonKey) {
      await localforage.setItem('seasonId', seasonKey);
      await localforage.setItem('season', this.dataBySeasons[seasonKey]);
      this.$router.push({
        name: "season-overview",
        params: { season: this.dataBySeasons[seasonKey], id: seasonKey }
      });
    },

    /**
     * Callback functions for data loading events
     */
    MatchJSONReady(matchesJSON) {
      localforage.setItem("Matches_JSON", matchesJSON);

      this.matchesData = matchesJSON;

      localforage.getItem("Matches_By_Seasons").then(Matches_By_Seasons => {
        if (Matches_By_Seasons) {
          Promise.resolve(Matches_By_Seasons).then(this.MatchesBySeasonsReady);
        } else {
          this.worker
            .postMessage("getDataBySeasons", [this.matchesData])
            .then(this.MatchesBySeasonsReady);
        }
      });
    },
    MatchesBySeasonsReady(matchesBySeasons) {
      localforage.setItem("Matches_By_Seasons", matchesBySeasons);
      this.dataBySeasons = matchesBySeasons;

      // Load ball data here for later use
      localforage.getItem("BallByBall_JSON").then(BallbyBallJSON => {
        if (BallbyBallJSON) {
          Promise.resolve(BallbyBallJSON).then(this.BallByBallJSONReady);
        } else {
          this.worker
            .postMessage("convertToJSON", [Ball_by_Ball])
            .then(this.BallByBallJSONReady);
        }
      });
    },
    BallByBallJSONReady(ballByBallJSON) {
      localforage.setItem("BallbyBall_JSON", ballByBallJSON);
      this.dataLoading = false;
    }
  }
};
</script>