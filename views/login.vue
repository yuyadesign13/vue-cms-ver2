<template>
  <div class="l-wrapper">
    <section class="l-section__loginpasscheck">
      <h2>Login page</h2>
      <label for="password">パスワード</label>
      <span class="c-space"></span>
      <input id="password" type="password" v-model="password" class="c-password" />
      <br /><br />
      <button @click="login" class="c-button c-button__primary">送信</button>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
    };
  },
  methods: {
    login() {
      this.$store.dispatch("login", this.password);
    },
  },
};
</script>