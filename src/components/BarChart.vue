<template>
  <canvas ref="chartCanvas"></canvas>
</template>


<script>
import Chart from "chart.js";

export default {
  props: ["type", "dataProp", "options", "xStepSize", "yStepSize"],
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    console.log(this.dataProp, this.options, this.type);
    console.log('mounted')
    this.chart = new Chart(this.$refs.chartCanvas, {
      data: this.dataProp,
      options: {
        ...this.options,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: this.xStepSize
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: this.yStepSize
              }
            }
          ]
        }
      },
      type: this.type
    });
  },
  watch: {
    dataProp: function() {
      console.log('updating charts...');
      this.chart.data = this.dataProp;
      this.chart.update();
    }
  }
};
</script>
