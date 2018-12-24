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

export default {
  name: "home",
  components: {
    WelcomingHeader
  },
  data() {
    return {
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
    this.$worker.run(arg => {
      return arg.split('\n')[0];
    }, [Ball_by_Ball])
      .then(result => console.log(result));
  }
};
</script>
