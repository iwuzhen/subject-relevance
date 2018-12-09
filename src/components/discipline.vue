<template>
  <div class="page-discipline">
    <div class="selectbox">
      <el-select v-model="subjectTarget" placeholder="请选择">
        <el-option
          v-for="item in categorysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        v-model="subjectRelevances"
        multiple
        collapse-tags
        style="margin-left: 20px;"
        placeholder="请选择">
        <el-option
          v-for="item in categorysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getData">确定</el-button>
    </div>
    <div class="echartsBox">

    </div>
  </div>
</template>

<script>
import { getData } from '@/api/index'
export default {
  name: 'discipline',
  data () {
    return {
      categorys: [
        'Artificial intelligence',
        'Philosophy',
        'Logic',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Computer science',
        'Psychology',
        'Linguistics',
        'Sociology',
        'History',
        'Economics',
        'Political science',
        'Engineering disciplines'
      ],
      subjectTarget: '',
      subjectRelevances: []
    }
  },
  computed: {
    categorysOptions: function () {
      return this.categorys.map(item => {
        return {
          value: item,
          label: item
        }
      })
    }
  },
  methods: {
    async getData () {
      let opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances.join(','),
        method: 'linksin',
        level: '0'
      }
      let _data = await getData(opt)
      console.log(_data)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
