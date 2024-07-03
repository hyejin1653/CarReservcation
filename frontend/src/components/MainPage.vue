<template>
  <div class="main">
    <div class="logo">
      <img src="../assets/GC_Symbol_color.png" style="width: 100px" />
    </div>
    <MenuBar class="menu-bar" @clickMenu="clickMenu" />
    <!--<div class="reserv-div" v-if="menu == 'reservation'">
      <div style="display: flex">
        <div class="sub-div1">차량번호</div>
        <div class="sub-div2">
          <input type="text" class="input-text" />
        </div>
      </div>
      <div style="display: flex">
        <div class="sub-div1">사용자</div>
        <div class="sub-div2">
          <input type="text" class="input-text" />
        </div>
      </div>
      <div style="display: flex; outline: auto">
        <MyDatePicker></MyDatePicker>
      </div>
    </div>-->
    <car-list v-if="menu == 'search'"></car-list>
    <reservcation v-if="menu == 'reservation'"></reservcation>
  </div>
</template>
<script>
import CarList from "./CarList.vue";
import MyDatePicker from "./Control/MyDatePicker.vue";
import MenuBar from "./MenuBar.vue";
import Reservcation from "./Reservcation.vue";

export default {
  name: "MainPage",
  components: { MenuBar, CarList, MyDatePicker, Reservcation },
  data() {
    return {
      menu: "reservation",
      fromDt: "",
    };
  },
  methods: {
    clickMenu(menu) {
      this.menu = menu;
    },
  },
};
</script>
<style scoped>
.main {
  font-family: "Pretendard";
  padding: 20px;
}
.logo {
  text-align: center;
  margin-bottom: 10px;
}
.menu-bar {
  top: 100px;
  background-color: #3a82c5;
  color: white;
  /* outline: auto; */
}

.reserv-div {
  display: flex;
  margin-top: 10px;
}

.input-text {
  border: 1px solid #898989;
  border-radius: 5px;
}

.sub-div1 {
  width: 100px;
}
.sub-div2 {
  width: 200px;
}
</style>
