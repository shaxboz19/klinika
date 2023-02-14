<template>
  <div class="page _1">
    <div class="page-header _1">
      <span>{{ getVariables && getVariables.name }}</span>
      <h1>{{ getVariables && getVariables.title }}</h1>
      <ul>
        <!-- <li>
          <i class="fa-regular fa-clock"></i>
          <span>{{ getVariables && getVariables.duration }} min</span>
        </li> -->
        <li>
          <!-- <i class="fa-solid fa-video"></i> -->
          <span> {{ getVariables && getVariables.description }} </span>
        </li>
        <li>
          <span>
            {{ getVariables && getVariables.messageText }}
          </span>
          <!-- <ul>
            <li>
              <span
                >Установить готовое решение на
                <small>аккаунт клиента</small></span
              >
            </li>
          </ul> -->
        </li>
      </ul>
      <!-- <nuxt-link to="/"> Show more </nuxt-link> -->
    </div>
    <div class="page-body_1">
      <div class="page-body-calendar">
        <!-- <a-calendar :fullscreen="false" :locale="ru" @panelChange="onPanelChange" /> -->
        <client-only>
          <vc-date-picker
            v-model="selectDate"
            locale="ru"
            :attributes="attributes"
            :available-dates="availableDates"
            is-expanded
          ></vc-date-picker>
        </client-only>
      </div>
      <!-- <div class="gmt-time">
        <i class="fa-solid fa-earth-asia"></i>
        <a-form-item label="GMT">
          <a-select style="width: 75px" @change="handleChange">
            <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
              {{ (i + 9).toString(36) + i }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div> -->
    </div>
  </div>
</template>

<script>
import { en, ru } from "~/utils/calendarLocale.js";
import { mapGetters, mapState } from "vuex";
import { routes } from "../constants/router";

export default {
  name: "IndexPage",
  data() {
    return {
      en,
      ru,
      selectDate: null,
      attributes: [],
      availableDates: [],
      dates: null,
    };
  },
  async mounted() {
    try {
      const { data } = await this.$klin.get(
        "/getScheduleCache/cjq5rq01jvFnwNLuqiLr"
      );
      const { personId = 13 } = this.getVariables;
      for (const date in data) {
        for (const person in data[date]) {
          if (person == personId) {
            this.availableDates.push({
              start: new Date(date),
              end: new Date(date),
            });
          }
        }
      }

      if (this.availableDates.length === 0) {
        this.availableDates.push(new Date(1970, 1, 1));
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    onPanelChange(value, mode) {
      console.log(value, mode);
    },
    handleChange(e) {
      console.log(e);
    },
  },
  computed: {
    ...mapGetters("home", ["getClient", "getVariables"]),
    ...mapState(["client"]),
  },
  watch: {
    async selectDate(val) {
      const date = this.$moment(val).format("DD-MM-YYYY");
      const id = this.$route.query.id;
      try {
        const { data } = await this.$api.post(`/${this.client}/request`, {
          code: "date",
          params: {
            date,
          },
        });
        const step = data.currentNode?.title || "";
        const route = routes[step];
        this.$router.push({ name: route, query: { date, id } });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style>
.gmt-select {
  width: 75px;
}
</style>
