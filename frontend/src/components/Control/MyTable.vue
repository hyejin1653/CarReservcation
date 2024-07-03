<template>
  <Vue3EasyDataTable :headers="headers" :items="items" />
</template>
<script>
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

export default {
  name: "MyTable",
  components: { Vue3EasyDataTable },
  props: ["headers", "items"],
  data() {
    return {};
  },
};
</script>
