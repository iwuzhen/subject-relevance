<template>
  <div class="container">
    <v-btn
      absolute
      dark
      fab
      buttom
      right
      color="pink"
      @click.stop="dialog = !dialog"
    >
      <v-badge color="green" v-if="messageCount > 0" :content="messageCount">
        <v-icon>mdi-message-bulleted</v-icon>
      </v-badge>
      <v-icon v-else>mdi-message-bulleted</v-icon>
    </v-btn>
    <v-row justify="center">
      <v-dialog v-model="dialog" scrollable max-width="70vw">
        <keep-alive><ToDo :path="currentPath"/></keep-alive>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import ToDo from "./ToDo";

import { RequestBoard } from "@/api/index";
export default {
  name: "NoteBoard",
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    },
    messageCount() {
      return this.$store.state.messageCount;
    }
  },
  mounted() {
    this.updateCount();
  },
  watch: {
    currentPath() {
      this.updateCount();
    }
  },
  methods: {
    async updateCount() {
      let ret;
      if (this.currentPath == "/") {
        ret = await RequestBoard({}, "get");
      } else {
        ret = await RequestBoard({ path: this.currentPath }, "get");
      }
      this.$store.commit("changemessageCount", ret.length);
    }
  },
  props: {
    path: {
      type: String,
      require: true
    }
  },
  components: {
    ToDo
  }
};
</script>
