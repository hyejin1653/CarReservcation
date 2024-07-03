<template>
  <div class="box">
    <date-picker
      v-model:value="baseDt"
      :type="dtType"
      placeholder="Select datetime"
      :show-time-panel="showTimePanel"
      @close="handleOpenChange"
      @change="dateChange"
    >
      <template #footer>
        <button class="mx-btn mx-btn-text" @click="toggleTimePanel">
          {{ showTimePanel ? "select date" : "select time" }}
        </button>
      </template>
    </date-picker>
  </div>
</template>

<script>
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";

export default {
  name: "MyDatePicker",
  components: { DatePicker },
  props: ["type", "setDate", "dtType", "oneDayFlag", "changeFlag"],
  data() {
    return {
      baseDt: "", //new Date(),
      showTimePanel: false,
      showTimeRangePanel: false,
    };
  },
  watch: {
    setDate(val) {
      this.baseDt = new Date(val);
    },
    changeFlag(val) {
      console.log("changeFlag : ", val, this.setDate);
      if (!val) {
        let baseDt = this.convertDt(this.setDate, "datetime");
        console.log(baseDt);
        this.$emit("selectDate", baseDt, this.type);
      }
    },
  },
  mounted() {
    if (!this.oneDayFlag) {
      this.baseDt = new Date(this.setDate);
    }
  },
  methods: {
    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    },
    convertDt(dt, format) {
      this.formatStore.setBaseDt(dt, format);
      return this.formatStore.getBaseDt;
    },
    handleOpenChange() {
      let baseDt = this.convertDt(this.baseDt, this.dtType);
      this.$emit("selectDate", baseDt, this.type);
      this.showTimePanel = false;
    },
    dateChange() {
      let baseDt = this.convertDt(this.baseDt, "date");
      this.$emit("dateChange", baseDt, this.type);
    },
  },
};
</script>
<style scoped>
.box {
  display: flex;
}

.mx-datepicker .mx-input-wrapper .mx-input {
  height: 100px !important;
}
</style>
