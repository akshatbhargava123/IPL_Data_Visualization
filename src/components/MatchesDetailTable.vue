<template>
    <el-table :data="matches" border height="400" align="center">
      <el-table-column
        label="Date"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.Match_Date | PlainDate }}
        </template>
      </el-table-column>
      <el-table-column
        label="Details"
        width="380"
      >
        <template slot-scope="scope">
          <h3>{{ `Team_Name_${scope.row.Team_Name_Id} VS Team_Name_${scope.row.Opponent_Team_Id}` }}</h3>
          <p>{{ `Team_Name_${scope.row.Match_Winner_Id} won by ${scope.row.Won_By} ${scope.row.Win_Type}` }}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="address"
        label="Address">
      </el-table-column> -->
  </el-table>
</template>

<script>
export default {
  name: "MatchesDetailTable",
  props: ["matches"],
  data() {
    return { tableData: [] };
  },
  created() {
    if (this.matches) {
      this.tableData = this.matches.sort(
        (m1, m2) => new Date(m1.Match_Date) > new Date(m2.Match_Date)
      );
    }
  }
};
</script>

<style scoped>
.col {
  text-align: center;
  background: red;
}
</style>
