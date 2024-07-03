<template>
  <div class="main">
    <section class="flex mb-5">
      <img src="../assets/GC_Symbol_color.png" style="width: 30px" />&nbsp;
      <h1>차량 예약 시스템</h1>
    </section>

    <section class="flex">
      <div class="combo">
        <v-combobox
          v-model="carNo"
          density="compact"
          label="차량번호"
          :items="carItems"
          variant="outlined"
        ></v-combobox>
      </div>
      <div class="mt-1 ml-10 mr-3"><h3>일자</h3></div>
      <div class="flex">
        <MyDatePicker
          v-model="fromDt"
          type="fromDt"
          dtType="date"
          :setDate="fromDt"
          @selectDate="selectDate"
        ></MyDatePicker>
        &nbsp;~&nbsp;
        <MyDatePicker
          v-model="toDt"
          type="toDt"
          dtType="date"
          :setDate="toDt"
          @selectDate="selectDate"
        ></MyDatePicker>
      </div>
      <span class="ml-5"
        ><v-btn color="#3a82c5" width="100" @click="searchData">검색</v-btn
        >&nbsp;
        <v-btn color="#3e4da1" width="100" @click="reservBtn(true)"
          >예약</v-btn
        ></span
      >
    </section>
    <section class="mt-4 context">
      <div class="flex">
        <!--<div class="flex-sub" style="width: 10%">차번호</div>-->
        <div class="flex-sub" style="width: 30%">차종</div>
        <div class="flex-sub" style="width: 40%">상태</div>
        <div class="flex-sub" style="width: 30%">이력</div>
      </div>
    </section>
    <section>
      <div class="flex sub-box" v-for="(item, index) of items" :key="index">
        <!--<div style="width: 10%">
          <div class="mt-12">
            <h2>{{ item.car_no }}</h2>
          </div>
        </div>
        -->
        <div class="flex" style="width: 30%">
          <div><img :src="getImageUrl(item.car_type)" class="img-row" /></div>
          <div class="ml-10 mt-10">
            <div>{{ item.car_no }}</div>
            <div style="color: #898989; font-size: 14px">
              {{ item.car_dept }}
            </div>
          </div>
        </div>
        <div class="detail-div">
          <div class="flex">
            <div :class="item.flag_eng == 'Y' ? 'red' : 'green'"></div>
            <div class="mt-9">{{ item.flag }}</div>
          </div>
          <div class="stats-div" v-if="item.flag_eng == 'Y'">
            {{ item.car_user }}, {{ item.car_dept }}, {{ item.base_dt }}
          </div>
        </div>
        <div class="history">
          <ul v-for="(dtl, dIndex) in item.detail" :key="dIndex">
            <li>
              <v-icon>mdi-circle-small</v-icon> {{ dtl.car_user }},
              {{ dtl.dept }},
              {{ dtl.baseDt }}
            </li>
          </ul>
        </div>
      </div>
    </section>
    <reservcation
      v-if="dialog"
      @reservBtn="reservBtn"
      :carItems="carsubItems"
    ></reservcation>
    <!---->
  </div>
</template>
<script>
import MyDatePicker from "./Control/MyDatePicker.vue";
import Reservcation from "./Reservcation.vue";
export default {
  components: { MyDatePicker, Reservcation },
  name: "ReservMain",
  data() {
    return {
      fromDt: null,
      toDt: null,
      items: [],
      carItems: ["전체"],
      carsubItems: [],
      carNo: "전체",
      dialog: false,
    };
  },
  mounted() {
    this.fromDt = this.convertDt(new Date());
    this.toDt = this.convertDt("2024-04-30");

    this.carList();
    this.searchData();
  },
  methods: {
    carList() {
      this.axios.get(`/api/getCarInfo`).then((res) => {
        this.carItems = res.data.map((item) => item.car_no);
        this.carsubItems = res.data.map((item) => item.car_no);
        this.carItems.unshift("전체");
      });
    },
    convertDt(dt) {
      this.formatStore.setBaseDt(dt, "date");
      return this.formatStore.getBaseDt;
    },
    getImageUrl(name) {
      return new URL(`../assets/img/${name}.PNG`, import.meta.url).href;
    },
    searchData() {
      let carNo = this.carNo == "전체" ? "" : this.carNo;
      this.axios
        .get("/api/getCarList", {
          params: { fromDt: this.fromDt, toDt: this.toDt, carNo: carNo },
        })
        .then((res) => {
          this.items = res.data;
        });
    },
    selectDate(dt, type) {
      if (type == "fromDt") {
        this.fromDt = dt;
      } else if (type == "toDt") {
        this.toDt = dt;
      }
    },
    reservBtn(flag) {
      this.dialog = flag;
    },
  },
};
</script>
<style scoped>
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
.main {
  padding: 30px;
  font-family: "Pretendard";
  position: relative;
  z-index: 1;
}

.combo {
  width: 200px;
  margin-right: 10px;
}
.flex {
  display: flex;
}
.outLine {
  outline: auto;
}
.context {
  border-top: 1px solid #898989;
  border-bottom: 1px solid #898989;
}
.flex-sub {
  text-align: center;
  height: 30px;
  background-color: #f1f3f5;
}
.img-row {
  width: 250px;
}
.sub-box {
  border-bottom: 1px solid #898989;
  height: 180px;
  padding: 20px;
}

.red {
  margin-top: 37px;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 20px;
}

.green {
  margin-top: 37px;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  background-color: green;
  border-radius: 20px;
}

.detail-div {
  width: 40%;
  padding: 20px;
}

.stats-div {
  color: #898989;
  font-size: 14px;
}

.history {
  width: 30%;
  font-size: 12px;
  overflow-y: auto;
}
</style>
