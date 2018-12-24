<template>
  <div class="home">
    <WelcomingHeader msg="Welcome to Your Vue.js App"/>
    <apexchart type="area" height="500" :options="chartOptions" :series="series" />
  </div>
</template>

<script>
// @ is an alias to /src
import WelcomingHeader from "@/components/WelcomingHeader.vue";
import Ball_by_Ball from "@/assets/Ball_by_Ball.csv";
import Match from "@/assets/Match.csv";

import workerActions from "../webworker.actions";

export default {
  name: "home",
  components: {
    WelcomingHeader
  },
  data() {
    return {
      ballByBallData: null,
      matchesData: null,
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chartOptions: {
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: "smooth"
        },

        xaxis: {
          type: "datetime",
          categories: [
            "2018-09-19T00:00:00",
            "2018-09-19T01:30:00",
            "2018-09-19T02:30:00",
            "2018-09-19T03:30:00",
            "2018-09-19T04:30:00",
            "2018-09-19T05:30:00",
            "2018-09-19T06:30:00"
          ]
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm"
          }
        }
      }
    };
  },
  created() {
    const worker = this.$worker.create(workerActions);

    worker.postMessage('convertToJSON', [Ball_by_Ball])
      .then(result => this.ballByBallData = result);

    worker.postMessage('convertToJSON', [Match])
      .then(result => this.matchesData = result);
  }
};
</script>
