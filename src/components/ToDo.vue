<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-07-23 13:10:20
 * @LastEditors: ider
 * @LastEditTime: 2020-12-15 13:14:45
 * @Description:
-->

<template>
  <v-card max-width="70vw">
    <v-card-title>Public Note</v-card-title>
    <v-divider />
    <v-card-text style="height: 60vh;">
      <v-list three-line>
        <v-subheader>todo</v-subheader>
        <template v-for="(item, index) in todoitems">
          <v-list-item :key="index">
            <v-list-item-action>
              <v-checkbox
                v-model="item.active"
                @change="finshTodo"
              />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.content }} </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon :to="item.path" v-on="on">
                    <v-icon color="grey lighten-1">mdi-file-find</v-icon>
                  </v-btn>
                </template>
                <span>{{ item.path }}</span>
              </v-tooltip>
            </v-list-item-action>

            <v-list-item-action>
              <v-btn icon @click="editItem(item)">
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>

            <v-list-item-action>
              <v-btn
                icon
                @click="
                  dialogRemove = !dialogRemove;
                  delItem = item;
                "
              >
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="index + 'divider'" inset />
        </template>
      </v-list>
      <v-list three-line>
        <v-subheader>complete</v-subheader>
        <template v-for="(item, index) in fishitems">
          <v-list-item :key="index">
            <v-list-item-action>
              <v-checkbox
                v-model="item.active"
                @change="finshTodo"
              />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                class="text-decoration-line-through"
                v-html="item.title"
              />
              <v-list-item-subtitle
                class="text-decoration-line-through"
                v-html="item.content"
              />
            </v-list-item-content>

            <v-list-item-action>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon :to="item.path" v-on="on">
                    <v-icon color="grey lighten-1">mdi-file-find</v-icon>
                  </v-btn>
                </template>
                <span>{{ item.path }}</span>
              </v-tooltip>
            </v-list-item-action>

            <v-list-item-action>
              <v-btn icon @click="editItem(item)">
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>

            <v-list-item-action>
              <v-btn
                icon
                @click="
                  dialogRemove = !dialogRemove;
                  delItem = item;
                "
              >
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider :key="index + 'divider'" inset />
        </template>
      </v-list>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="updateList">刷新</v-btn>
      <v-btn color="blue darken-1" text @click="newItem">New</v-btn>
    </v-card-actions>

    <v-dialog v-model="dialogEdit" persistent scrollable max-width="60vw">
      <v-card>
        <v-card-title>Note</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12" sm="6" md="7">
                  <v-text-field v-model="editOpt.title" label="标题" required />
                </v-col>

                <v-col cols="12" sm="5" md="4">
                  <v-text-field
                    v-model="editOpt.path"
                    class="mb-5"
                    label="主题位置"
                    required
                    disabled
                  /> </v-col></v-row>

              <v-textarea
                v-model="editOpt.content"
                label="细节"
                placeholder="more..."
              />
              <v-btn color="success" class="mr-4" @click="SubmitBoard">
                提交
              </v-btn>
              <v-btn color="primary" class="mr-4" @click="dialogEdit = false">
                撤销
              </v-btn>
            </v-form>
            <v-row />
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRemove" scrollable max-width="20vw">
      <v-card>
        <v-card-title>确认删除</v-card-title>
        <v-card-actions>
          <v-btn color="success" @click="deleteItem">
            确认
          </v-btn>
          <v-btn color="primary" @click="dialogRemove = !dialogRemove">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { RequestBoard } from '@/api/index'

export default {
  name: 'ToDo',
  props: {
    path: {
      type: String,
      require: true,
      default: '/'
    }
  },
  data() {
    return {
      dialogEdit: false,
      dialogRemove: false,
      delItem: null,
      editOpt: {
        id: 0,
        title: '',
        content: '',
        path: '',
        stars: 0,
        active: false
      },
      todoitems: [],
      fishitems: []
    }
  },
  computed: {
    currentPath() {
      return this.$route.path
    }
  },
  watch: {
    currentPath() {
      this.updateList()
    }
  },
  mounted() {
    console.log('mount')
    this.updateList()
  },
  methods: {
    async updateList() {
      this.fishitems = []
      this.todoitems = []
      let ret
      if (this.currentPath === '/') {
        ret = await RequestBoard({}, 'get')
      } else {
        ret = await RequestBoard({ path: this.currentPath }, 'get')
      }
      this.$store.set('pages/message_count', ret.length)
      for (const row of ret) {
        if (row.active === true) {
          this.fishitems.push(row)
        } else {
          this.todoitems.push(row)
        }
      }
    },

    editItem(item) {
      console.log(item)
      console.log(this.changeFlag)
      this.editOpt = item
      this.dialogEdit = true
    },
    newItem() {
      this.editOpt = {
        title: '',
        content: '',
        path: this.currentPath,
        stars: 0,
        active: false
      }
      this.dialogEdit = true
    },
    async deleteItem() {
      if (this.delItem) {
        await RequestBoard(this.delItem, 'delete')
        await this.updateList()
        this.dialogRemove = false
      }
      this.delItem = null
    },
    async SubmitBoard() {
      await RequestBoard(this.editOpt, 'post')
      await this.updateList()
      this.dialogEdit = false
    },
    dolog(value) {
      console.log(value)
      console.log(this.todoitems)
    },
    finshTodo() {
      setTimeout(() => {
        for (const i in this.todoitems) {
          if (this.todoitems[i].active === true) {
            RequestBoard(this.todoitems[i], 'post')
            this.fishitems.unshift(this.todoitems[i])
            this.todoitems.splice(i, 1)
            break
          }
        }

        for (const i in this.fishitems) {
          if (this.fishitems[i].active === false) {
            RequestBoard(this.fishitems[i], 'post')
            this.todoitems.unshift(this.fishitems[i])
            this.fishitems.splice(i, 1)
            break
          }
        }
      }, 100)
    }
  }
}
</script>
