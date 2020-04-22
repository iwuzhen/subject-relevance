<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar> -->

    <v-content>
      <v-breadcrumbs :items="items" large></v-breadcrumbs>

      <router-view v-on:emitMesage="message" />
    </v-content>
    <v-snackbar v-model="snackbar" top :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({ snackbar: false, timeout: 2000, text: "" }),
  mounted() {},
  methods: {
    message(text) {
      this.text = text;
      this.snackbar = true;
    }
  },
  computed: {
    currentPath: function() {
      return this.$store.state.curentPath;
    },
    items: function() {
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
  }
};
</script>
