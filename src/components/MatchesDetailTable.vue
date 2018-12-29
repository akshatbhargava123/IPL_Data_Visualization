<template>
  <el-row>
    <el-col :span="18" :offset="3">
    <el-table :data="matches" border height="650" align="center">
      <el-table-column label="Id" width="120">
        <template slot-scope="scope">
          {{ scope.row.Match_Id }}
        </template>
      </el-table-column>
      <el-table-column label="Date" width="120">
        <template slot-scope="scope">
          {{ scope.row.Match_Date | PlainDate }}
        </template>
      </el-table-column>
      <el-table-column label="Details" width="380">
        <template slot-scope="scope">
          <h3>
            <span :class="scope.row.Team_Name_Id == scope.row.Match_Winner_Id  ? 'winner' : 'loser'">{{ `Team_Name_${scope.row.Team_Name_Id}` }}</span>
            VS
            <span :class="scope.row.Opponent_Team_Id == scope.row.Match_Winner_Id ? 'winner' : 'loser'">{{ `Team_Name_${scope.row.Opponent_Team_Id}` }}</span>
          </h3>
          <p>{{ scope.row.Win_Type != 'Tie' ? `Team_Name_${scope.row.Match_Winner_Id} won by ${scope.row.Won_By} ${scope.row.Win_Type}` : scope.row.Win_Type == 'Tie' ? 'No Winner - Tie Match' : 'No Result' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="NRR">
        <template slot-scope="scope">
          <h3>
            {{ matchesDetail[scope.row.Match_Id] ? matchesDetail[scope.row.Match_Id].Net_Run_Rate ? matchesDetail[scope.row.Match_Id].Net_Run_Rate : 'Calc Failed due to insufficient data!' : 'Calc Failed due to insufficient data!' }}
          </h3>
        </template>
      </el-table-column>
      <el-table-column label="Team stats">
        <template slot-scope="scope">
          <p>{{ `Team_Name_${scope.row.Team_Name_Id}` }}</p>
          <h3>
            {{
            (matchesDetail[scope.row.Match_Id][1].teamId == scope.row.Team_Name_Id ?
              `${matchesDetail[scope.row.Match_Id][1].runs} / ${matchesDetail[scope.row.Match_Id][1].totalOuts}`:
              `${matchesDetail[scope.row.Match_Id][2].runs} / ${matchesDetail[scope.row.Match_Id][2].totalOuts}`)
            }}
          </h3>
          <p>{{ `Team_Name_${scope.row.Opponent_Team_Id}` }}</p>
          <h3>
            {{
            (matchesDetail[scope.row.Match_Id][1].teamId == scope.row.Opponent_Team_Id ?
              `${matchesDetail[scope.row.Match_Id][1].runs} / ${matchesDetail[scope.row.Match_Id][1].totalOuts}`:
              `${matchesDetail[scope.row.Match_Id][2].runs} / ${matchesDetail[scope.row.Match_Id][2].totalOuts}`)
            }}
          </h3>
          <!-- <h5>{{ `Team_Name_${scope.row.Match_Winner_Id}` }}</h5>
          <p>{{ matchesDetail[scope.row.Match_Id][scope.row.Team_Name_Id].runs }} / {{ matchesDetail[scope.row.Match_Id][scope.row.Opponent_Team_Id].caught }}</p> -->
        </template>
      </el-table-column>
    </el-table>
    </el-col>
    <el-col :span="3"></el-col>
  </el-row>
</template>

<script>
export default {
  name: "MatchesDetailTable",
  props: ["matches", "matchesDetail"],
  data() {
    return { tableData: [] };
  },
  created() {
    if (this.matches) {
      this.tableData = this.matches.sort(
        (m1, m2) => new Date(m1.Match_Date) > new Date(m2.Match_Date)
      );
    }
    // console.log(this.matches)
  },
  updated() {
    // console.log(this.matches)
  },
  mounted() {
    // console.log(this.matches)
  }
};
</script>

<style scoped>
.col {
  text-align: center;
  background: red;
}
.winner {
  color: green;
}
.loser {
  color: red;
}
</style>
