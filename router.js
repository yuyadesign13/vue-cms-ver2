import Vue from "vue";
import Router from "vue-router";
import home from "./views/home.vue";
import postDetails from "./views/postDetails.vue";
import login from "./views/login.vue";
import adminHome from "./views/adminHome.vue";
import adminAdd from "./views/adminAdd.vue";
import adminEdit from "./views/adminEdit.vue";
import store from "./store";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: home,
      meta: { title: "vue-cms-home", desc: "vueとfirebaseで作成したcmsです。" },
    },
    {
      path: "/postDetails/:id",
      component: postDetails,
      props: true,
      meta: { title: "", desc: "" },
    },
    {
      path: "/login",
      component: login,
      meta: { title: "login", desc: "管理画面loginページ" },
    },
    {
      path: "/adminHome",
      component: adminHome,
      beforeEnter(to, from, next) {
        if (store.getters.password) {
          next();
        } else {
          next("/");
        }
      },
      meta: { title: "admin-home", desc: "管理画面ホームページ" },
    },
    {
      path: "/adminAdd",
      component: adminAdd,
      beforeEnter(to, from, next) {
        if (store.getters.password) {
          next();
        } else {
          next("/");
        }
      },
      meta: { title: "admin-add", desc: "管理画面新規投稿ページ" },
    },
    {
      path: "/adminEdit/:id",
      component: adminEdit,
      props: true,
      beforeEnter(to, from, next) {
        if (store.getters.password) {
          next();
        } else {
          next("/");
        }
      },
      meta: { title: "admin-edit", desc: "管理画面編集ページ" },
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
