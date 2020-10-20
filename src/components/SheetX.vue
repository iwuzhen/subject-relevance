<template>
  <v-card
    class="mx-auto"
    elevation="1"
  >
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <aside>{{ desc }}</aside>
    </v-card-text>
    <v-card-text> <p><code>*</code>:&lt;0.05 <code>**</code>:0.05~0.1 <code>***</code>:0.1~0.15 <code>****</code>:&gt;0.15</p></v-card-text>
    <v-card-text>
      <HotTable ref="hotTableComponent" :cells="cell" :data="data" :manual-column-move="true" :row-headers="false" :col-headers="false" license-key="non-commercial-and-evaluation" />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="addrow">
        增加一行
      </v-btn>
      <v-btn @click="addcol">
        增加一列
      </v-btn>
      <v-btn @click="clearEmpty">
        清除空行空列
      </v-btn>
      <v-btn @click="saveGirdData">
        保存
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import Handsontable from 'handsontable'

function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)
  td.style.fontWeight = 'bold'
  td.style.color = 'green'
  td.style.background = '#CEC'
}
function SheetXValueRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments)

  // if row contains negative number
  const nm = parseFloat(value)
  if (col !== 0) {
    td.className = 'htCenter'
  } else {
    td.className = 'htLeft'
  }
  td.style.color = 'black'
  if (!value || value === '') {
    td.style.background = '#EEE'
  } else if (nm < 0.05) {
    td.innerHTML = '*'
    // const textNode = document.createTextNode('x')
    // td.replaceChild(textNode)
  } else if (nm < 0.1 && nm > 0.05) {
    td.innerHTML = '**'
    // const textNode = document.createTextNode('xx')
    // td.replaceChild(textNode)
  } else if (nm < 0.15 && nm > 0.1) {
    td.innerHTML = '***'
    // const textNode = document.createTextNode('xx')
    // td.replaceChild(textNode)
  } else if (nm > 0.15) {
    td.innerHTML = '****'
    // const textNode = document.createTextNode('xx')
    // td.replaceChild(textNode)
  } else {
    td.style.background = ''
  }
}
Handsontable.renderers.registerRenderer('SheetXValueRenderer', SheetXValueRenderer)

export default {
  name: 'SheetX',
  components: {
    HotTable
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    storagekey: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
    // console.log(console.log(this.storagekey, this.data, this.$refs.hotTableComponent.hotInstance.getData()))
  },
  methods: {
    cell(row, col) {
      var cellProperties = {}
      if (row === 0) {
        cellProperties.renderer = firstRowRenderer // uses function directly
      } else {
        cellProperties.renderer = 'SheetXValueRenderer' // uses lookup map
      }
      return cellProperties
    },
    saveGirdData() {
      this.$emit('sheetSave', [this.storagekey, this.$refs.hotTableComponent.hotInstance.getData()])
    },
    addrow() {
      this.$refs.hotTableComponent.hotInstance.alter('insert_row', 100)
    },
    addcol() {
      this.$refs.hotTableComponent.hotInstance.alter('insert_col', 100)
    },
    clearEmpty() {
      const girddata = this.$refs.hotTableComponent.hotInstance.getData()
      const empty_row = new Set([...new Array(girddata.length).keys()])
      const empty_col = new Set([...new Array(girddata[0].length).keys()])
      for (const row_i in girddata) {
        for (const col_i in girddata[row_i]) {
          const item = girddata[row_i][col_i]
          if (item !== '' && item !== undefined && item !== null) {
            empty_row.delete(Number(row_i))
            empty_col.delete(Number(col_i))
          }
        }
      }
      // console.log(empty_row, empty_col)
      if (empty_row.size > 0) { this.$refs.hotTableComponent.hotInstance.alter('remove_row', Array.from(empty_row).map(item => [item, 1])) }
      if (empty_col.size > 0) { this.$refs.hotTableComponent.hotInstance.alter('remove_col', Array.from(empty_col).map(item => [item, 1])) }
    },
    editTodo({ todo, value }) {
      this.$emit('editTodo', { todo, value })
    },
    toggleTodo(todo) {
      this.$emit('toggleTodo', todo)
    }
  }
}
</script>
