<template>
  <div>
    <div class="menu-nav">
      <div class="menu-sub" @click="menuClick('search')">
        <v-btn variant="text" width="300">차량 조회</v-btn>
      </div>
      <div class="menu-sub" @click="menuClick('reservation')">
        <v-btn variant="text" width="300">차량 예약</v-btn>
      </div>
      <div class="menu-sub" @click="menuClick('newCar')">
        <v-btn variant="text" width="300">신규 등록</v-btn>
      </div>
      <div class="menu-sub"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MenuBar",
  data() {
    return {};
  },
  methods: {
    menuClick(menu) {
      this.$emit("clickMenu", menu);
    },
  },
};
</script>
<style scoped>
.menu-nav {
  text-align: center;
  display: flex;
}

.menu-sub {
  width: 25%;
}
</style>
