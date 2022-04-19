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
      <v-badge v-if="messageCount > 0" color="green" :content="messageCount">
        <v-icon>mdi-message-bulleted</v-icon>
      </v-badge>
      <v-icon v-else>mdi-message-bulleted</v-icon>
    </v-btn>
    <v-row justify="center">
      <v-dialog v-model="dialog" scrollable max-width="70vw">
        <keep-alive><ToDo :path="currentPath" /></keep-alive>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import ToDo from './ToDo'
import { get } from 'vuex-pathify'

import { RequestBoard } from '@/api/index'
export default {
  name: 'NoteBoard',
  components: {
    ToDo
  },
  props: {
    path: {
      type: String,
      require: true,
      default: '/'
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    currentPath() {
      return this.$route.path
    },
    messageCount: get('pages/message_count')
  },
  watch: {
    currentPath() {
      this.updateCount()
    }
  },
  mounted() {
    this.updateCount()
  },
  methods: {
    async updateCount() {
      let ret
      if (this.currentPath === '/') {
        ret = await RequestBoard({}, 'get')
      } else {
        ret = await RequestBoard({ path: this.currentPath }, 'get')
      }
      this.$store.set('pages/message_count', ret.length)
    }
  }
}
</script>
