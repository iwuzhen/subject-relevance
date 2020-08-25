<template>
  <v-app>
    <v-main>
      <NoteBoard path="cc" />
      <v-breadcrumbs
        :items="items"
        large
      > </v-breadcrumbs>

      <router-view v-on:emitMesage="message" />
    </v-main>
    <v-snackbar
      v-model="snackbar"
      top
      :timeout="timeout"
    >
      {{ text }}
    </v-snackbar>
  </v-app>
</template>

<script>
import NoteBoard from "./components/NoteBoard";

export default {
  name: "App",

  data: () => ({ snackbar: false, timeout: 2000, text: "" }),
  mounted() { },
  methods: {
    message(text) {
      this.text = text;
      this.snackbar = true;
    }
  },
  computed: {
    currentPath: function () {
      return this.$store.state.curentPath;
    },
    items: function () {
      return [
        {
          text: "首页",
          disabled: false,
          to: "/"
        },
        {
          text: this.$store.state.curentPath,
          disabled: true
        }
      ];
    }
  },
  components: {
    NoteBoard
  }
};
</script>
