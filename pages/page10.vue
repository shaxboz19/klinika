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
          <h2>Выберите специалиста</h2>
          <!-- <span>Продолжительность: 30 мин</span> -->
        </div>
        <div class="page-body-time-body">
          <ul>
            <li v-for="(item, index) of employees" :key="index">
              <span v-if="!item.isActive" @click="onClickTime(index)">
                <span>
                  {{ item.lastname }} {{ item.firstname }} {{ item.patronymic }}
                </span>
                <small>{{ item.positionName }}</small>
              </span>
              <a-row :gutter="[12, 0]" v-else>
                <a-col span="12">
                  <a-button
                    type="primary"
                    class="grey"
                    @click="item.isActive = !item.isActive"
                  >
                    {{ item.firstname }} {{ item.lastname }}
                  </a-button>
                </a-col>
                <a-col span="12">
                  <a-button
                    type="primary"
                    class="blue"
                    @click="clickTime(item)"
                  >
                    Подтвердить
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
      employees: [],
      weekDay: null,
      date: null,
    };
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get(
        "/klin/getEmployees/cjq5rq01jvFnwNLuqiLr"
      );
      data.forEach((e) => {
        e.isActive = false;
      });
      this.employees = data;
      console.log(this.employees);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    onClickTime(index) {
      this.employees.forEach((el) => {
        el.isActive = false;
      });
      this.employees[index].isActive = true;
    },
    handleChange(e) {
      console.log(e);
    },
    async clickTime(item) {
      try {
        const form = {
          id: item.id,
        };
        const { data } = await this.$axios.post(`/api/${this.client}/request`, {
          code: "persons",
          params: {
            ...form,
          },
        });
        const step = data.currentNode?.title || "";
        const route = routes[step];
        this.$router.push({ name: route, query: { id: item.id } });
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
