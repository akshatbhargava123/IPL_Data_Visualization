<template>
  <el-row :gutter="10">
    <el-col :span="6" v-for="match of seasons" :key="match[0].Season_Id">
      <div @click="emitClick(match[0].Season_Id)">
        <el-card shadow="hover" class="card">
          <h3>Season {{ match[0].Season_Id }}</h3>
          <p>Total matches: {{ match.length }}</p>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "SeasonSelect",
  props: ['dataBySeasons'],
  data() {
    return {
      seasons: []
    }
  },
  created() {
    Object.keys(this.dataBySeasons).forEach(key => {
      this.seasons.push(this.dataBySeasons[key]);
    });
    console.log(this.seasons)
  },
  methods: {
    emitClick(season) {
      this.$emit('seasonClick', season);
    }
  }
};
</script>

<style scoped>

  .card {
    border: 2.4px solid #5A5754;
    margin: 4px;
    padding: 0px;
    cursor: pointer;
    background: #E8E8E8;
  }

  .card:hover {
    -webkit-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);
  }

  h3 {
    margin: 0px;
  }

  p {
    margin: 0px;
  }

</style>

