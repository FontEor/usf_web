<template>
  <basic-dialog
    :visible="visible"
    :width="600"
    :handle-close="handleClose"
    :title="title"
    :closeText="'关闭'"
    :showFt="false"
    class="export-dialog"
  >
    <div class="content-wrapper">
      {{ this.content }}
    </div>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
export default {
  name: "ExportDialog",
  mixins: [EntityDialog],
  props: {
    winClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClose() {
      this.winClose();
    },
  },
};
</script>
<style lang="scss" scoped>

.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
</style>

