<template>
  <v-card
    class="mx-auto"
    elevation="2"
  >
    <v-container>
      <v-row>
        <v-col cols="auto">note</v-col>
        <v-spacer />
        <v-col v-if="textAreaStatus" cols="auto"><a href="http://www.aqcoder.com/markdown" target="_blank" rel="noopener noreferrer">Markdown example</a></v-col>

        <v-col cols="auto">
          <v-btn v-if="!textAreaStatus" small color="primary" @click="doEdit">
            编辑笔记
          </v-btn>
          <v-btn v-if="textAreaStatus" small color="success" @click="saveGirdData">
            保存笔记
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-scroll-x-transition>
          <v-col v-if="textAreaStatus">
            <v-textarea
              v-model="content"
              label="Markedown"
              auto-grow
              shaped
              outlined
            />
          </v-col>
        </v-scroll-x-transition>
        <v-col elevation="3">
          <markdown-it-vue class="md-body" :content="content" />
        </v-col>
      </v-row>
    </v-container>

  </v-card>
</template>

<script>
import MarkdownItVue from '@ruangnazi/markdown-it-vue'
import '@ruangnazi/markdown-it-vue/dist/markdown-it-vue.css'
import { getStorage, createStorage } from '@/api/index'

export default {
  name: 'Comment',
  components: {
    MarkdownItVue
  },
  props: {
    storagekey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      textAreaStatus: false,
      col: 0,
      content: 'no content',
      options: {
        markdownIt: {
          html: true,
          linkify: true,
          typographer: true
        },
        linkAttributes: {
          attrs: {
            target: '_self',
            rel: 'noopener'
          }
        }
      }
    }
  },
  computed: {
  },
  mounted() {
    this.init()
  },
  methods: {
    doEdit() {
      this.textAreaStatus = true
    },
    saveGirdData() {
      this.textAreaStatus = false
      this.saveStorageData(this.storagekey, { content: this.content })
    },
    toggleTodo(todo) {
      this.$emit('toggleTodo', todo)
    },
    async init() {
      const data = await this.getStorageData(this.storagekey)
      if (data) {
        this.content = data.content
      }
    },
    async getStorageData(key) {
      const opt = {
        path: key
      }
      const data = await getStorage(opt)
      return data.data.Data
    },
    async saveStorageData(key, data) {
      const opt = {
        path: key,
        data: data
      }
      await createStorage(opt)
    }
  }
}
</script>
