<template>
  <div class="l-wrapper__admin">
    <section class="l-section__admin">
      <h2>Admin Home(All Posts)</h2>
      <div v-for="(post, index) in posts" :key="index" class="c-float">
        <h3 class="c-admin__text">{{ post.title }}</h3>
        <div class="c-float__left">
          <p>
            <router-link :to="'/adminEdit/' + post.id">update</router-link>
          </p>
          <p>
            <button @click="deleteMessage(post.key, post.id)" class="c-delete">
              delete
            </button>
          </p>
        </div>
      </div>
    </section>
    <section class="l-section__admin-new">
      <h2>Add Posts</h2>
      <p class="l-link">
        <router-link to="/adminAdd">新規投稿はこちら</router-link>
      </p>
      <span class="c-space"></span>
    </section>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getStorage, ref, deleteObject } from "firebase/storage";

export default {
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    deleteMessage(key, id) {
      firebase.database().ref("contents").child(key).remove();

      // delete-----------------------------------------------

      const storage = getStorage();

      const desertRef = ref(storage, id.toString());

      deleteObject(desertRef)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });

      let tmpobj = [];

      firebase
        .database()
        .ref("contents")
        .on("value", function (snapshot) {
          snapshot.forEach(function (children) {
            const tmp = {
              id: children.val().id,
              date: children.val().date,
              category: children.val().category,
              title: children.val().title,
              content: children.val().content,

              key: children.key,
            };
            tmpobj.push(tmp);
          });
        });
      this.posts = tmpobj;

      this.$store.dispatch("setContentsAction", this.posts);
    },
  },

  mounted() {
    this.posts = this.$store.getters.contents;
  },
};
</script>