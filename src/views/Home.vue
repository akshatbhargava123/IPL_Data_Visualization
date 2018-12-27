<template>
  <Loading v-if="dataLoading" />
  <SeasonSelect v-else :dataBySeasons="dataBySeasons" @seasonClick="seasonSelected" />
</template>

<script>
import localforage from "localforage";

import SeasonSelect from "@/components/SeasonSelect.vue";
import Loading from "@/components/Loading.vue";

import Match from "@/assets/Match.csv";
import Ball_by_Ball from "@/assets/Ball_by_Ball.csv";

import store, { STORE_KEYS } from "../sharedservice";

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
  created() {
    this.worker = store.getItem(STORE_KEYS.WORKER);
    localforage.setDriver(localforage.INDEXEDDB);

    localforage.getItem("Matches_JSON").then(Matches_JSON => {
      if (Matches_JSON) {
        Promise.resolve(Matches_JSON).then(this.MatchJSONReady);
      } else {
        this.worker
          .postMessage("convertToJSON", [Match])
          .then(this.MatchJSONReady);
      }
    });
  },
  methods: {
    seasonSelected(seasonKey) {
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