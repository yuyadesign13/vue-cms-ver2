<template>
  <div>
    <div class="l-wrapper__post">
      <section class="l-section__content">
        <h2>{{ post.title }}</h2>
        <img v-if="thumbnail" :src="thumbnail" height="300px" />
        <ul class="l-right">
          <li>
            <ul>
              <li
                v-for="(cat, index) in post.category"
                :key="index"
                class="c-category"
              >
                {{ cat }}
              </li>
            </ul>
          </li>
          <li>date:{{ post.date }}</li>
        </ul>
        <p class="c-content">{{ post.content }}</p>
      </section>
      <section class="l-section__comment">
        <h2>Comment</h2>
        <ul>
          <li v-for="(comment, index) in comments" :key="index">
            <ul class="c-comment">
              <li>{{ comment.name }}</li>
              <li>{{ comment.comment }}</li>
            </ul>
          </li>
        </ul>
      </section>
      <section class="l-section__addcomment">
        <h2>Add Comment</h2>
        <p>name</p>
        <input v-model="name" class="c-input" />
        <span class="c-space"></span>
        <p>comment</p>
        <textarea v-model="comment" class="c-textarea" />
        <br />
        <button @click="addComment" class="c-button c-button__primary">
          コメントを追加
        </button>
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
      post: [],
      targetId: this.id,
      name: "",
      comment: "",
      comments: [],
      thumbnail: "",
      key: "",
      urlparam: "",
    };
  },
  props: ["id"],
  methods: {
    addComment() {
      firebase.database().ref("comments").push({
        id: this.post.key,
        name: this.name,
        comment: this.comment,
      });
    },
  },
  beforeMount() {
    this.urlparam = this.$route.path.substr(13).toString();
  },
  mounted() {
    if (
      this.$store.getters.contents == "" ||
      this.$store.getters.contents == null
    ) {
      const param = this.urlparam;
      let tmpobj = [];
      const storage = getStorage();
      firebase
        .database()
        .ref("contents")
        .on("value", function (snapshot) {
          snapshot.forEach(function (children) {
            if (param == children.val().id) {
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
            }
          });
        });

      const sto = () => {
        const pop = tmpobj.pop();
        this.post = pop;
        this.thumbnail = this.post.thumbnail;
        this.key = this.post.key;

        let tmpkey = this.post.key;
        let tmpcomments = [];

        firebase
          .database()
          .ref("comments")
          .on("value", function (snapshot) {
            snapshot.forEach(function (children) {
              if (tmpkey == children.val().id) {
                const tmp = {
                  id: children.val().id,
                  name: children.val().name,
                  comment: children.val().comment,
                };
                tmpcomments.push(tmp);
              }
            });
          });

        this.comments = tmpcomments;
        document.title = this.post.title;
        document
          .querySelector("meta[name='description']")
          .setAttribute("content", this.post.content);
      };

      setTimeout(sto, 1000);
    } else {
      this.post = this.$store.getters.contents.find(
        (content) => content.id == this.targetId
      );
      const storage = getStorage();
      getDownloadURL(ref(storage, this.post.id.toString()))
        .then((url) => {
          this.thumbnail = url;
        })
        .catch((error) => {
          console.log(error);
        });
      this.comments = this.$store.getters.comments.filter(
        (comment) => comment.id == this.post.key
      );
      document.title = this.post.title;
      document
        .querySelector("meta[name='description']")
        .setAttribute("content", this.post.content);
    }
  },
};
</script>