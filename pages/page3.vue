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
          <span>Продолжительность: 30 мин</span>
        </div>
        <div class="page-body-time-body">
          <ul>
            <li v-for="(item, index) in times" :key="index">
              <span @click="onClickTime(index)" v-if="!item.isActive">
                С: {{ item.startTime }} По: {{ item.endTime }}
              </span>
              <a-row :gutter="[12, 0]" v-else>
                <a-col span="12">
                  <a-button
                    type="primary"
                    class="grey"
                    @click="item.isActive = !item.isActive"
                  >
                    С: {{ item.startTime }} По: {{ item.endTime }}
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      times: [],
      weekDay: null,
      date: null,
    };
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get(
        "/klin/getSchedule/cjq5rq01jvFnwNLuqiLr?date=" + this.$route.query.date
      );
      for (const key in data.employees) {
        if (key == this.$route.query.id) {
          data.employees[key].forEach((e) => {
            e.isActive = false;
          });
          this.times = data.employees[key];
        }
      }
    } catch (error) {
      console.error(error);
    }
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
    clickTime(item) {
      const { date, id } = this.$route.query;
      
      this.$router.push({ name: "page4", query: {date, id, startTime: item.startTime, endTime: item.endTime} });
    },
  },
  computed: {
    ...mapGetters("home", ["getClient", "getVariables"]),
  },
};
</script>

<style></style>
