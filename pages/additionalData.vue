<template>
  <div class="page _1" v-if="!isClose">
    <div class="page-header _1">
      <span>{{ getClient && getClient.name }}</span>
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
          <i class="fa-regular fa-calendar"></i>
          <span> {{ startTime }} - {{ endTime }}, {{ date }} </span>
        </li>
        <!-- <li>
          <i class="fa-solid fa-earth-asia"></i>

          <span> Moscow time </span>
        </li> -->
      </ul>
    </div>
    <div class="page-body _1">
      <div class="page-body-form">
        <h2>Введите дополнительные данные</h2>
        <a-row :gutter="[0, 16]">
          <!-- <a-col span="24">
            <a-form-item label="Name">
              <a-input> </a-input>
            </a-form-item>
          </a-col> -->
          <!-- <a-col span="24">
            <a-form-item label="Email">
              <a-input> </a-input>
            </a-form-item>
          </a-col>
          <a-col span="24">
            <a-button type="primary" class="blue">Add guests</a-button>
          </a-col>
          <a-col span="24">
            <a-form-item label="Phone">
              <a-input> </a-input>
            </a-form-item>
          </a-col> -->
          <a-col span="24">
            <a-form-item label="Имя">
              <a-input
                v-model="form.firstname"
                :class="{
                  error:
                    $v.form.firstname.$dirty && !$v.form.firstname.required,
                }"
              >
              </a-input>
            </a-form-item>
            <div
              class="error"
              v-if="$v.form.firstname.$dirty && !$v.form.firstname.required"
            >
              Обязательное поле
            </div>
          </a-col>
          <a-col span="24">
            <a-form-item label="Фамилия">
              <a-input
                v-model="form.surname"
                :class="{
                  error: $v.form.surname.$dirty && !$v.form.surname.required,
                }"
              >
              </a-input>
            </a-form-item>
            <div
              class="error"
              v-if="$v.form.surname.$dirty && !$v.form.surname.required"
            >
              Обязательное поле
            </div>
          </a-col>
          <a-col span="24">
            <a-form-item label="Отчество">
              <a-input v-model="form.patronymic"> </a-input>
            </a-form-item>
          </a-col>
          <a-col span="24">
            <a-form-item label="Телефон">
              <a-input
                v-model="form.telephone"
                v-mask="'+7##########'"
                :class="{
                  error:
                    ($v.form.telephone.$dirty && !$v.form.telephone.required) ||
                    ($v.form.telephone.$dirty &&
                      !$v.form.telephone.minLength) ||
                    ($v.form.telephone.$dirty && !$v.form.telephone.maxLength),
                }"
              >
              </a-input>
            </a-form-item>
            <div
              class="error"
              v-if="$v.form.telephone.$dirty && !$v.form.telephone.required"
            >
              Обязательное поле
            </div>
            <div
              class="error"
              v-else-if="
                $v.form.telephone.$dirty && !$v.form.telephone.minLength
              "
            >
              Введите корректный номер телефона
            </div>
            <div
              class="error"
              v-else-if="
                $v.form.telephone.$dirty && !$v.form.telephone.maxLength
              "
            >
              Введите корректный номер телефона
            </div>
          </a-col>
          <a-col span="24" label="Возраст">
            <a-form-item label="Возраст">
              <a-input-number
                id="inputNumber"
                :min="1"
                v-model="form.age"
                :class="{
                  error: $v.form.age.$dirty && !$v.form.age.required,
                }"
              />
            </a-form-item>
            <div
              class="error"
              v-if="$v.form.age.$dirty && !$v.form.age.required"
            >
              Обязательное поле
            </div>
          </a-col>
          <a-col span="24">
            <a-form-item label="Комментарий">
              <a-textarea v-model="comment"> </a-textarea>
            </a-form-item>
          </a-col>

          <a-col span="24">
            <a-button type="primary" class="blue" @click="onSubmit"
              >Отправить</a-button
            >
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
  <div v-else class="error-message">
    {{ getVariables.finalMessage || "Данные успешно сохранены" }}
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
// import { personId } from "../constants/env";
export default {
  name: "IndexPage",
  data() {
    return {
      form: {
        surname: "",
        firstname: "",
        patronymic: "",
        age: null,
        telephone: "+7",
      },
      comment: "",
      endTime: null,
      startTime: null,
      date: null,
      isClose: false,
      isSendRequest: false,
      persons: [],
    };
  },
  validations: {
    form: {
      surname: { required },
      firstname: { required },
      age: { required },
      telephone: {
        required,
        minLength: minLength(12),
        maxLength: maxLength(12),
      },
    },
  },
  computed: {
    ...mapGetters("home", ["getClient", "getVariables"]),
    ...mapState(["client"]),
    getTime() {},
  },
  async mounted() {
    const interval = this.$route.query.interval || 30;
    if (window.visualViewport) {
      function resizeHandler() {
        for (const sessionView of document.getElementsByClassName(
          "SessionView"
        )) {
          sessionView.style.height =
            window.visualViewport.height.toString() + "px";
          document.getElementsByTagName("html")[0].style.height =
            window.visualViewport.height.toString() + "px";
        }
      }

      window.visualViewport.addEventListener("resize", resizeHandler);
    }
    this.startTime = this.$route.query.time;
    this.date = this.$moment(this.$route.query.date, "DD-MM-YYYY").format(
      "dddd MMM Do YYYY"
    );
    const date = this.$route.query.date;
    const time = this.$route.query.time;
    const dateTime = date + " " + time;
    const endDateTime =
      new Date(this.$moment(dateTime, "DD-MM-YYYY HH:mm").format()).getTime() +
      interval * 60 * 1000;
    this.endTime = this.$moment(endDateTime).format("HH:mm");
    this.isSendRequest = this.getVariables.isSendRequest || false;
    const { data } = await this.$klin.get(`/getEmployees/cjq5rq01jvFnwNLuqiLr`);
    this.persons = data;
  },
  methods: {
    onPanelChange(value, mode) {
      console.log(value, mode);
    },
    handleChange(e) {
      console.log(e);
    },
    async onSubmit() {
      const { id: personId } = this.$route.query;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        try {
          const { date, time } = this.$route.query;
          const form = {
            client: {
              ...this.form,
              proccesingOfPersonalData: true,
            },
            visitItems: [
              {
                employeeId: personId,
                serviceId: 163,
                startTime: time,
              },
            ],
            employee: {
              id: personId,
            },
            visit: {
              date,
              comment: this.comment,
            },
          };
          if (this.isSendRequest) {
            await this.$klin.post(`/createVisit/cjq5rq01jvFnwNLuqiLr`, form);
          }

          const { firstname, lastname, patronymic } = this.persons.find(
            (e) => e.id == personId
          );

          form.employee.name = `${lastname} ${firstname} ${patronymic}`;
          await this.$api.post(`/${this.client}/request`, {
            code: "submit",
            params: {
              ...form,
            },
          });
          this.isClose = true;
        } catch (error) {
          console.log(error);
          const {
            data: { message },
          } = error.response;
          this.errorHandler(message);
        }
      }
    },
  },
};
</script>
<style>
.error {
  color: red;
  border-color: red;
}
</style>
