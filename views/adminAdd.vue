<template>
  <div class="l-wrapper__addPost">
    <section class="l-section__addPost">
      <h2>新規投稿</h2>
      <p>title</p>
      <input v-model="title" class="c-input" />
      <span class="c-space"></span>
      <p>category</p>
      <input v-model="categories" class="c-input" />
      <span class="c-space"></span>
      <p>content</p>
      <textarea v-model="content" class="c-textarea" />
      <span class="c-space"></span>
      <p>thumbnail</p>
      <input type="file" @change="fileUpload" />
      <span class="c-space"></span>
      <img v-if="img_url" :src="img_url" width="200" height="auto" />
      <span class="c-space"></span>
      <button @click="addContent" class="c-button c-button__primary">
        add
      </button>
      <p class="l-link">
        <router-link to="/adminHome">Admin Home</router-link>
      </p>
    </section>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default {
  name: "Home",
  data() {
    return {
      title: "",
      content: "",
      categories: "",
      contents: [],
      img_url: "",
      file: "",
    };
  },
  methods: {
    fileUpload(props) {
      this.file = props.target.files[0];
      this.img_url = URL.createObjectURL(this.file);
    },
    addContent() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let today = year + "-" + month + "-" + day;

      let categories = "";
      if (this.categories.includes(",")) {
        categories = this.categories.split(",").map((e) => e.trim());
      } else {
        categories = this.categories;
      }

      let ids = this.$store.getters.contents.map((e) => e.id);
      let id = Math.max.apply(null, ids) + 1;

      firebase.database().ref("contents").push({
        id: id,
        date: today,
        category: categories,
        title: this.title,
        content: this.content,
      });

      //upload----------------------------------------------------

      const storage = getStorage();

      const storageRef = ref(storage, id.toString());

      uploadBytes(storageRef, this.file).then((snapshot) => {
        console.log("blobかfileをアップロード", snapshot);
      });

      //vuexに入れなおし----------------------------------------------------

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
  created() {},
};
</script>