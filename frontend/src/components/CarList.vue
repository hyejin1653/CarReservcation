<template>
  <div>
    <my-table class="my-table" :headers="headers" :items="items"></my-table>
  </div>
</template>
<script>
import MyTable from "./Control/MyTable.vue";
export default {
  name: "CarList",
  components: { MyTable },
  data() {
    return {
      headers: [
        { text: "차량번호", value: "car_no" },
        { text: "사용자", value: "car_user" },
        { text: "시작일자", value: "from_dt" },
        { text: "종료일자", value: "to_dt" },
        { text: "부서", value: "dept" },
      ],
      items: [],
    };
  },
  mounted() {
    this.searchData();
  },
  methods: {
    searchData() {
      console.log("dd");
      this.axios.get(`/api/getCarList`, (res) => {
        console.log("21", res.data);
      });
    },
  },
};
</script>
<style>
.my-table {
  margin-top: 10px;
}
</style>
