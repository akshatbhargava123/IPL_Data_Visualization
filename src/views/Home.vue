<template>
  <Loading v-if="dataBySeasonsLoading" />
  <SeasonSelect v-else :dataBySeasons="dataBySeasons" @seasonClick="seasonSelected" />
</template>

<script>
// @ is an alias to /src
import SeasonSelect from "@/components/SeasonSelect.vue";
import Loading from "@/components/Loading.vue";

import Match from "@/assets/Match.csv";

import store,{ STORE_KEYS } from '../sharedservice';

export default {
  name: "home",
  components: {
    SeasonSelect,
    Loading
  },
  data() {
    return {
      matchesData: null,

      dataBySeasons: null,
      dataBySeasonsLoading: true
    };
  },
  created() {
    const worker = store.getItem(STORE_KEYS.WORKER);

    worker.postMessage('convertToJSON', [Match])
      .then(result => {

        // Setting Match data for first time
        store.setItem(STORE_KEYS.MATCH_DATA_JSON, result);
        this.matchesData = result;

        worker.postMessage('getDataBySeasons', [this.matchesData])
          .then(res => {
            this.dataBySeasons = res;
            this.dataBySeasonsLoading = false;
            // store.setItem(STORE_KEYS.MATCH_DATA_BY_SEASON, res.map(d => d.matches));
          });
      });
  },
  methods: {
    seasonSelected(seasonKey) {
      this.$router.push({
        name: 'season-overview',
        params: { season: this.dataBySeasons[seasonKey], id: seasonKey }
      });
    }
  }
};
</script>