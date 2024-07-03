<template>
  <v-card title="예약 등록" class="res-main">
    <v-card-text>
      <!--<div class="sub-div">
        <v-sheet height="500">
          <VCalendar
            ref="calendar"
            :events="events"
            v-model="calendarE"
            :interval-height="10"
            :intervals="10"
          />
        </v-sheet>
      </div>-->
      <div class="mt-6">
        <section class="input-top">
          <div class="input-title">차량번호&nbsp;&nbsp;</div>
          <div style="width: 300px">
            <v-combobox
              v-model="car_no"
              density="compact"
              label="차량번호"
              :items="carItems"
              variant="outlined"
            ></v-combobox>
            <!--<v-text-field
              v-model="car_no"
              variant="outlined"
              density="compact"
            ></v-text-field>
            -->
          </div>
        </section>
        <section class="input-top">
          <div class="input-title">사용자&nbsp;&nbsp;</div>
          <div style="width: 300px">
            <v-text-field
              v-model="user"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </div>
        </section>
        <section class="input-top">
          <div class="input-title">사용 부서&nbsp;&nbsp;</div>
          <div style="width: 300px">
            <v-text-field
              v-model="dept"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </div>
        </section>
        <section class="input-top">
          <div class="input-title">시작 일자&nbsp;&nbsp;</div>
          <MyDatePicker
            type="fromDt"
            v-model="fromDt"
            :setDate="fromDt"
            :changeFlag="changeFlag"
            dtType="datetime"
            @selectDate="selectDate"
            @dateChange="dateChange"
          ></MyDatePicker
          >&nbsp;&nbsp;
          <v-checkbox
            label="하루"
            density="compact"
            v-model="oneDayFlag"
            @click="oneDayClick"
          ></v-checkbox>
        </section>
        <section class="input-top" v-if="!oneDayFlag">
          <div class="input-title">종료 일자&nbsp;&nbsp;</div>
          <MyDatePicker
            type="toDt"
            dtType="datetime"
            v-model="toDt"
            :setDate="toDt"
            :oneDayFlag="oneDayFlag"
            @selectDate="selectDate"
            @dateChange="dateChange"
          ></MyDatePicker>
        </section>

        <section class="mt-7 text-right">
          <v-btn @click="saveClick" color="green">등록</v-btn>&nbsp;
          <v-btn @click="closeBtn" color="red">닫기</v-btn>
        </section>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { VCalendar } from "vuetify/labs/VCalendar";
import MyDatePicker from "./Control/MyDatePicker.vue";

export default {
  name: "Reservcation",
  components: { VCalendar, MyDatePicker },
  props: ["carItems"],
  data() {
    return {
      car_no: "",
      user: "",
      dept: "",
      carNo: "",
      fromDt: null,
      toDt: null,
      oneDayFlag: false,
      calendarE: null,

      changeFlag: true,

      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      events: [],
    };
  },
  mounted() {
    this.fromDt = new Date();
    this.toDt = new Date();
    this.searchData();
  },
  methods: {
    resetForm() {
      this.car_no = "";
      this.user = "";
      this.dept = "";
      this.fromDt = new Date();
      this.toDt = new Date();
    },
    searchData() {
      this.axios.get(`/api/getCarList`).then((res) => {
        for (let data of res.data) {
          let obj = {};
          obj["title"] = `${data.car_no} ${data.car_user}`;
          obj["start"] = new Date(data.from_dt);
          obj["end"] = new Date(data.to_dt);
          obj["allDay"] = data.all_day == "Y" ? true : false;

          this.events.push(obj);
        }
      });
    },
    saveClick() {
      let obj = {};
      obj["car_no"] = this.car_no;
      obj["user"] = this.user;
      obj["dept"] = this.dept;
      obj["fromDt"] = this.fromDt;
      obj["toDt"] = this.toDt;
      obj["allDay"] = this.oneDayFlag ? "Y" : "N";

      //console.log(obj);
      this.axios.post(`/api/setCarInfo`, obj).then((res) => {
        if (res.status == 200) {
          this.searchData();
          this.resetForm();
        }
      });
    },
    selectDate(dt, type) {
      //console.log(dt, type);
      if (type == "fromDt") {
        this.fromDt = dt;
      } else if (type == "toDt") {
        this.toDt = dt;
      }

      this.changeFlag = true;
    },
    oneDayHandler() {
      //console.log(this.oneDayFlag);
    },
    convertDt(dt) {
      this.formatStore.setBaseDt(dt, "date");
      return this.formatStore.getBaseDt;
    },
    oneDayClick() {
      let fromDt = this.convertDt(this.fromDt);
      this.fromDt = fromDt + " 00:00:00";
      this.toDt = new Date(this.fromDt);
    },
    closeBtn() {
      this.$emit("reservBtn", false);
    },
    dateChange(dt, type) {
      // console.log(this.convertDt(this.fromDt), this.toDt);
      let fromDt =
        type == "fromDt" ? this.convertDt(dt) : this.convertDt(this.fromDt);
      let toDt =
        type == "toDt" ? this.convertDt(dt) : this.convertDt(this.toDt);

      if (fromDt > toDt) {
        alert("시작일자가 종료일자보다 클 수 없습니다.");
        this.changeFlag = false;
        return;
      }

      let obj = {};
      obj["fromDt"] = fromDt;
      obj["toDt"] = toDt;
      obj["carNo"] = this.car_no;

      this.axios.get("/api/getCarReservcation", { params: obj }).then((res) => {
        console.log(res.data);
        if (res.data == "Y") {
          alert("해당 차량은 예약이 등록 되어 있습니다.");
        }
      });
    },
  },
};
</script>
<style scoped>
.res-main {
  padding: 10px;
  display: flex;
  position: absolute;
  top: 10%;
  left: 50%;
  z-index: 5;
  box-shadow: 1px 1px 12px 3px #898989;
}

.input-text {
  border: 1px solid #898989;
  border-radius: 5px;
}
.input-title {
  margin-top: 7px;
  width: 100px;
}
.input-top {
  display: flex;
}

.outLine {
  outline: auto;
}
</style>
