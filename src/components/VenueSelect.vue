<template>
  <el-row :gutter="10">
    <el-col :span="12" v-for="match of dataByVenues" :key="match[0].Venue_Name">
      <div @click="emitClick(match[0].Newlands)">
        <smart-card>
          <span slot="heading">{{ match[0].Venue_Name }}</span>
          <span slot="content">Total matches: {{ match.length }}</span>
          <span slot="content-2">{{ match[0].City_Name + ', ' + match[0].Host_Country }}</span>
        </smart-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import SmartCard from "@/components/SmartCard";

export default {
  name: "VenueSelect",
  props: ["dataByVenues"],
  components: { SmartCard },
  created() {
    console.log(this.dataByVenues)
  },
  methods: {
    emitClick(venue) {
      this.$emit("venueClick", venue);
    }
  }
};
</script>
