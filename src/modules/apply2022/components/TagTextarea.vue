<template>
  <form @submit.prevent>
    <div class="taggle-container">
      <div class="taggle-badge">0/1000</div>
    </div>
  </form>
</template>
<script>
import Taggle from "taggle"
import { cloneDeep } from "lodash"

export default {
  props: {
    value: {
      type: Array,
      require: true
    },
    errors: {
      type: Array,
      default: () => ([])
    }
  },
  watch: {
    value: {
      handler(n) {
        this.resetTaggleTags(n)
      },
      immediate: true,
      deep: true,
    },
    errors: {
      handler() {
        this.resetTaggleTags(this.innerValue, false)
      },
      immediate: true,
      deep: true,
    }
  },
  data() {
    return {
      innerValue: [],
      tagInstance: null
    }
  },
  mounted() {
    this.tagInstance = new Taggle(this.$el.firstElementChild,
    {
      onBeforeTagAdd: this.onBeforeTagAdd,
      onBeforeTagRemove: this.onBeforeTagRemove,
      tagFormatter: this.onBeforeInsert,
      placeholder: "最多支持输入1000个账号。账号用“,”隔开",
      allowDuplicates: true,
      saveOnBlur: true,
      preserveCase: true
    })
    this.tagInstance.removeAll();
    this.resetTaggleTags(this.innerValue, false)
  },
  methods: {
    resetTaggleTags(n, deep = true) {
      if(deep) {
        this.innerValue = cloneDeep(n);
      }
      if(this.tagInstance) {
        this.clearValues();
        this.tagInstance.add(n);
      }
    },
    onBeforeTagAdd(event, tag) {
      const currentIndex = this.innerValue.indexOf(tag);
      if(currentIndex !== -1) {
        this.$message.error(`已经添加过此账号:${tag}`)
        return false
      }
      this.innerValue.push(tag);
      return true
    },
    onBeforeTagRemove(event, tag) {
      const currentIndex = this.innerValue.indexOf(tag);
      if(currentIndex !== -1) {
        this.innerValue.splice(currentIndex, 1)
      }
      return true
    },
    onBeforeInsert(element) {
      const content = element.innerText.slice(0, -1);
      const hasErr = this.errors.includes(content);
      if(hasErr) {
        element.className = "taggle taggle-error";
      }
      return element;
    },
    getValues() {
      return this.innerValue
    },
    clearValues() {
      this.innerValue = [];
      this.tagInstance.removeAll();
    }
  }
}
</script>
