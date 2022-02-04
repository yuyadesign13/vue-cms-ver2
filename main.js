import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";

import firebase from "firebase/compat/app";
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.firebase = firebase;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
