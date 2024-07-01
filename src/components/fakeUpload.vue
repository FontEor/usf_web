<template>
  <div class="fake-import-container" @click="onToast">
    暂时关闭导入功能。
    <img ref="img" class="fake-import-img" src="/static/upload_image.jpg" alt="" onerror="onError"/>
  </div>
</template>
<script>
export default {
  name: "FakeUpload",
  methods: {
    onToast(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$message.error('为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）')
      return false;
    },
    onError() {
      const $img = this.$refs.img;
      $img.parentElement.removeChild($img)
    }
  }
}
</script>
<style lang="scss" scope>
.fake-import-container {
  position: relative;
  width: 378px;
  height: 185px;
  .fake-import-img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>