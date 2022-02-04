<template>
  <div class="l-wrapper__addPost">
    <section class="l-section__addPost">
      <h2>Edit Post</h2>
      <p>title</p>
      <input v-model="editTitle" class="c-input" />
      <span class="c-space"></span>
      <p>category</p>
      <input v-model="editCategories" class="c-input" />
      <span class="c-space"></span>
      <p>content</p>
      <textarea v-model="editContent" class="c-textarea" />
      <span class="c-space"></span>
      <p>thumbnail</p>
      <input type="file" @change="fileUpload" />
      <span class="c-space"></span>
      <img v-if="img_url" :src="img_url" width="200" height="auto" />
      <span class="c-space"></span>
      <button @click="updateMessage()" class="c-button c-button__primary">
        update
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      post: [],
      targetId: this.id,
      editTitle: "",
      editContent: "",
      editCategories: "",
      img_url: "",
      file: "",
    };
  },
  props: ["id"],
  methods: {
    fileUpload(props) {
      this.file = props.target.files[0];
      this.img_url = URL.createObjectURL(this.file);
    },
    updateMessage() {
      let categories = "";
      if (this.editCategories.includes(",")) {
        categories = this.editCategories.split(",").map((e) => e.trim());
      } else {
        categories = this.editCategories;
      }

      firebase.database().ref("contents").child(this.post.key).update({
        category: categories,
        title: this.editTitle,
        content: this.editContent,
      });

      //upload----------------------------------------------------

      if (this.file != "") {
        const storage = getStorage();
        const storageRef = ref(storage, this.post.id.toString());

        uploadBytes(storageRef, this.file).then((snapshot) => {
          console.log("blobかfileをアップロード", snapshot);
        });
      }

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

    this.post = this.$store.getters.contents.find(
      (content) => content.id == this.targetId
    );

    this.editTitle = this.post.title;
    this.editCategories = this.post.category;
    this.editContent = this.post.content;

    const storage = getStorage();

    getDownloadURL(ref(storage, this.post.id.toString()))
      .then((url) => {
        this.img_url = url;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>