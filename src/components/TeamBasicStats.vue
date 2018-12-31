<template>
  <el-row>
    <el-col :span="24">
      <h4>Runs Stat</h4>
      <p>Total Runs: {{ totalRuns }}</p>
      <p>Total Extra Runs: {{ totalExtraRuns }}</p>
      <div class="chart">
        <line-chart
          type="radar"
          :dataProp="runChart.data"
          :options="runChart.options"
          xStepSize="1"
        ></line-chart>
      </div>
    </el-col>
    <el-col :span="24">
      <h4>Outs Stat</h4>
      <p>Total Outs: {{ totalOuts }}</p>
      <div class="chart">
        <line-chart
          type="radar"
          :dataProp="outChart.data"
          :options="outChart.options"
          xStepSize="1"
        ></line-chart>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import LineChart from "@/components/LineChart";

export default {
  name: 'TeamBasicStats',
  props: ['totalRuns', 'totalExtraRuns', 'totalOuts', 'runChart', 'outChart'],
  components: {
    LineChart
  }
}
</script>

