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
import _ from 'lodash'

export default {
  name: 'App',
  components: {
    NoteBoard
  },

  data: () => ({ snackbar: false, timeout: 2000, text: '' }),
  computed: {
    ...get('route', [
      'hash',
      'path'
    ]),
    items: function() {
      // 双层目录 chart
      let path = _.trim(this.path, '/').split('/')
      if (path.length < 2) {
        path = this.$store.get('pages/page_name')
      } else {
        path = path[0] + '-' + this.$store.get('pages/page_name')
      }
      // 保留根目录 hash
      if (this.path === '/') {
        this.$store.set('pages/root_hash', this.hash)
      }
      return [
        {
          text: '首页',
          disabled: false,
          to: `/${this.$store.get('pages/root_hash')}`
        },
        {
          text: path,
          disabled: true
        }
      ]
    }
  },
  mounted() {
    // set('pages/message_count', 123)
    // console.log('vx', get('pages', 'message_count'))
  },
  methods: {
    message(text) {
      this.text = text
      this.snackbar = true
    }
  }
}
</script>
