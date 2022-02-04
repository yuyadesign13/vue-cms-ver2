<template>
  <div id="app">
    <Header></Header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "./components/header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
  methods: {
    setMeta(route) {
      if (route.meta.title) {
        let setTitle = route.meta.title;
        document.title = setTitle;
      }
      if (route.meta.desc) {
        let setDesc = route.meta.desc;
        document
          .querySelector("meta[name='description']")
          .setAttribute("content", setDesc);
      }
    },
  },
  mounted() {
    let route = this.$route;
    this.setMeta(route);
  },
  watch: {
    $route(route) {
      this.setMeta(route);
    },
  },
};
</script>

<style>
@import "./css/style.css";
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
