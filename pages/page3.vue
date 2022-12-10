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
          <h2>Выберите время</h2>
          <span>Продолжительность: {{ visitDuration }} мин</span>
        </div>
        <div class="page-body-time-body">
          <ul>
            <li v-for="(item, index) in times" :key="index">
              <span @click="onClickTime(index)" v-if="!item.isActive">
                {{ item.time }}
              </span>
              <a-row :gutter="[12, 0]" v-else>
                <a-col span="12">
                  <a-button
                    type="primary"
                    class="grey"
                    @click="item.isActive = !item.isActive"
                  >
                    {{ item.time }}
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
import { routes } from "../constants/router";
export default {
  data() {
    return {
      times: [],
      weekDay: null,
      date: null,
      visitDuration: 30,
    };
  },
  async mounted() {
    this.visitDuration = +this.getVariables?.visitDuration || 30;
    const { startTime, endTime, date } = this.$route.query;
    const start = this.parseDate(date, startTime);
    const end = this.parseDate(date, endTime);
    let step = this.visitDuration * 60 * 1000;
    this.times = this.splitInterval(start, end, step);
  },
  methods: {
    onClickTime(index) {
      this.times.forEach((el) => {
        el.isActive = false;
      });
      this.times[index].isActive = true;
    },
    handleChange(e) {
      console.log(e);
    },
    async clickTime(item) {
      const { date, id } = this.$route.query;
      try {
        const { data } = await this.$api.post(`/${this.client}/request`, {
          code: "time",
          params: {
            time: item.time,
          },
        });
        const step = data.currentNode?.title || "";
        const route = routes[step];
        this.$router.push({
          name: route,
          query: { id, date, time: item.time },
        });
      } catch (error) {
        console.log(error);
      }
    },
    splitInterval(start, end, step) {
      let result = [];

      for (let ts = start; ts < end; ts += step) {
        const hour = new Date(ts).getHours();
        const min = new Date(ts).getMinutes();
        if (min == 0) {
          min = "00";
        }

        result.push({ time: `${hour}:${min}`, isActive: false });
      }

      // if (result.length == 1) {
      //   result.push(end);
      // }
      console.log(result);
      return result;
    },
    parseDate(date, time) {
      const [day, month, year] = date.split("-");
      const [hours, minutes] = time.split(":");
      const ts = new Date(+year, +month - 1, +day, hours, minutes).getTime();
      return ts;
    },
  },
  computed: {
    ...mapGetters("home", ["getClient", "getVariables"]),
    ...mapState(["client"]),
  },
};
</script>

<style></style>
