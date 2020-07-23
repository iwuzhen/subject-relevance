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
      <v-icon>mdi-message-bulleted</v-icon>
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
