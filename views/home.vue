<template>
  <div>
    <div class="l-wrapper">
      <section class="l-section__search">
        <h2>Search</h2>
        <input v-model="search" class="c-input" />
      </section>
      <section class="l-section__cms">
        <h2>All Post</h2>
        <div class="l-grid">
          <article
            class="l-grid__item l-item"
            v-for="post in filteredPosts"
            :key="post.id"
          >
            <router-link :to="'/postDetails/' + post.id">
              <div class="l-item__text">
                <h3 class="l-item__title">{{ post.title }}</h3>
                <p class="l-item__date">{{ post.date }}</p>
              </div>
              <img class="l-item__thumbnail" :src="post.thumbnail" />
            </router-link>
          </article>
        </div>
      </section>
      <section class="l-section__category">
        <h2>Category</h2>
        <ul class="l-category">
          <li
            v-for="(category, index) in categories"
            :key="index"
            class="l-category__item"
          >
            <a @click="selectCat(category)">{{ category }}</a>
          </li>
        </ul>
      </section>
      <section class="l-section__login">
        <h2>Admin</h2>
        <p class="p-small l-link">
          <router-link to="/login">管理画面はこちら</router-link>
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      posts: [],
      categories: [],
      search: "",
      uploadImageUrl: "",
      img_url: "",
      d_url: "",
    };
  },
  methods: {
    selectCat(category) {
      this.search = category;
      window.scrollY = 0;
    },
  },
  computed: {
    filteredPosts: function () {
      let posts = [];

      for (let i in this.posts) {
        let post = this.posts[i];

        if (
          post.title.indexOf(this.search) !== -1 ||
          post.content.indexOf(this.search) !== -1 ||
          post.category.indexOf(this.search) !== -1
        ) {
          posts.push(post);
        }
      }
      return posts;
    },
  },
  created() {
    let tmpobj = [];
    let tmpcat = [];
    const storage = getStorage();

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
            thumbnail: "", 
          };

          getDownloadURL(ref(storage, tmp.id.toString()))
            .then((url) => {
              tmp.thumbnail = url;
            })
            .catch((error) => {
              console.log(error);
            });
          tmpobj.push(tmp);

          const [cat] = tmp.category;

          if (cat.length != 1) {
            tmp.category.forEach(function (cat) {
              if (tmpcat.indexOf(cat) == -1) tmpcat.push(cat);
            });
          } else {
            if (tmpcat.indexOf(cat) == -1) tmpcat.push(tmp.category);
          }
        });
      });
    this.posts = tmpobj;
    this.$store.dispatch("setContentsAction", this.posts);

    this.categories = tmpcat;

    let comments = [];

    firebase
      .database()
      .ref("comments")
      .on("value", function (snapshot) {
        snapshot.forEach(function (children) {
          const tmp = {
            id: children.val().id,
            name: children.val().name,
            comment: children.val().comment,
          };
          comments.push(tmp);
        });
      });

    this.$store.dispatch("setCommentsAction", comments);
  },
};
</script>