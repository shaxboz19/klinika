<template>
  <div class="page _2">
    <div class="page-header _2">
      <h1>{{ weekDay }}</h1>
      <h2>{{ date }}</h2>
      <!-- <div class="gmt-time">
            <i class="fa-solid fa-earth-asia"></i>
            <a-form-item label="GMT">
              <a-select @change="handleChange">
                <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                  Moscow time
                </a-select-option>
              </a-select>
            </a-form-item>
          </div> -->
    </div>
    <div class="page-body 2">
      <div class="page-body-time">
        <div class="page-body-time-header">
          <h2>Выберите услугу</h2>
          <!-- <span>Продолжительность: 30 мин</span> -->
        </div>
        <div class="page-body-time-body">
          <ul>
            <li v-for="(item, index) of services" :key="index">
              <span v-if="!item.isActive" @click="onClickTime(index)">
                <span>
                  {{ item.title }}
                </span>
              </span>
              <a-row :gutter="[12, 0]" v-else>
                <a-col span="12">
                  <a-button
                    type="primary"
                    class="grey"
                    @click="item.isActive = !item.isActive"
                  >
                    {{ item.time }} минут
                  </a-button>
                </a-col>
                <a-col span="12">
                  <a-button
                    type="primary"
                    class="blue"
                    @click="clickTime(item)"
                  >
                    Подтверждать
                  </a-button>
                </a-col>
              </a-row>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { mapGetters, mapState } from "vuex";
import { services } from "../constants/services";
import { routes } from "../constants/router";
export default {
  data() {
    return {
      services: services,
      weekDay: null,
      date: null,
    };
  },
  async mounted() {
    this.services = services.map((e) => ({ ...e, isActive: false }));
  },
  methods: {
    onClickTime(index) {
      this.services.forEach((el) => {
        el.isActive = false;
      });
      this.services[index].isActive = true;
    },
    handleChange(e) {
      console.log(e);
    },
    async clickTime(item) {
      try {
        const form = {
          interval: item.time,
        };
        const { data } = await this.$api.post(`/${this.client}/request`, {
          code: "interval",
          params: {
            ...form,
          },
        });
        const step = data.currentNode?.title || "";
        const route = routes[step];
        const { date } = this.$route.query;
        this.$router.push({
          name: route,
          query: { interval: item.time, date },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapGetters("home", ["getClient", "getVariables"]),
    ...mapState(["client"]),
  },
};
</script>
  
  <style></style>
  