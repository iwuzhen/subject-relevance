<template>
  <v-app>
    <v-main>
      <NoteBoard path="cc" />
      <v-breadcrumbs
        :items="items"
        large
      />

      <router-view @emitMesage="message" />
    </v-main>
    <notifications group="foo" />
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
import NoteBoard from './components/NoteBoard'
import { get } from 'vuex-pathify'

export default {
  name: 'App',
  components: {
    NoteBoard
  },

  data: () => ({ snackbar: false, timeout: 2000, text: '' }),
  computed: {
    currentPath: function() {
      return this.$store.state.route.path
    },
    items: function() {
      return [
        {
          text: '首页',
          disabled: false,
          to: '/'
        },
        {
          text: this.$store.state.route.path.replace('/', ''),
          disabled: true
        }
      ]
    }
  },
  mounted() {
    // set('pages/message_count', 123)
    console.log('vx', get('pages', 'message_count'))
  },
  methods: {
    message(text) {
      this.text = text
      this.snackbar = true
    }
  }
}
</script>
