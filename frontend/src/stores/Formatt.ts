import { defineStore } from "pinia";

export const useFormatStore = defineStore("formatt", {
  state: () => ({
    baseDt: null,
  }),
  getters: {
    getBaseDt(state) {
      return state.baseDt;
    },
  },
  actions: {
    setBaseDt(value, dtType) {
      let tDate = new Date(value);
      let date = ("0" + tDate.getDate()).slice(-2);
      let month = ("0" + (tDate.getMonth() + 1)).slice(-2);
      let year = tDate.getFullYear();

      let hours =
        tDate.getHours().toString().length == 1
          ? "0" + tDate.getHours().toString()
          : tDate.getHours();
      let minutes =
        tDate.getMinutes().toString().length == 1
          ? "0" + tDate.getMinutes().toString()
          : tDate.getMinutes();
      let seconds =
        tDate.getSeconds().toString().length == 1
          ? "0" + tDate.getSeconds().toString()
          : tDate.getSeconds();

      //month + date + " " + hours + ":" + minutes + ":" + seconds;
      let baseDt = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

      if (dtType == "date") {
        baseDt = `${year}-${month}-${date}`;
      }

      this.baseDt = baseDt;
    },
  },
  persist: true,
});
