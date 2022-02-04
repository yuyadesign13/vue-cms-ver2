import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';

Vue.use(Vuex);

import firebase from "firebase/compat/app";
import "firebase/compat/database";

export default new Vuex.Store({
  namespaced: true,
  state() {
    return {
      contents: [],
      comments: [],
      password: '',
    }
  },
  getters: {
    password: state => state.password,
    contents: state => state.contents,
    comments: state => state.comments,

    contentById(state) {
      return function (_id) {
        let content = state.contents.find(content => content.id === _id);
        if (content) {
          return content;
        }
      }
    },

    commentsById(state) {
      return function (_id) {
        let comments = state.comments.filter(comment => comment.id === _id);
        if (comments) {
          return comments;
        }
      }
    },

  },
  mutations: {
    setContentsMutation(state, payload) {
      state.contents = payload;
    },
    setCommentsMutation(state, payload) {
      state.comments = payload;
    },
    login(state, password) {
      state.password = password;
    }
  },
  actions: {
    setContentsAction({ commit }, contents) {

      let payload = [];
      payload = contents;
      commit("setContentsMutation", payload);
    },
    setCommentsAction({ commit }, comments) {
      let payload = [];
      payload = comments;
      commit("setCommentsMutation", payload);
    },
    login({ commit }, password) {

      let pass = [];

      firebase
        .database()
        .ref("password")
        .on("value", snapshot => pass.push((snapshot.val())));

      const wait = (sec) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, sec * 1000);
          setTimeout(() => { 
            reject(new Error("エラー！"));
           }, sec * 1000);
        });
      };

      async function passCheck() {
        try {
          await wait(1);
          if (password == pass[0]) {
            commit('login', password);
            router.push('/adminHome');
          } else {
            this.password = '';
            alert('パスワードが異なります。');
          }
        } catch (err) {
          console.error(err);
          this.password = '';
          alert('パスワードが異なります。');
        }
      }
      passCheck();

    },
  },
  modules: {
  }
});
