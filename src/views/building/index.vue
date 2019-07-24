<template>

  <div class="map-container">
    <LxBaiduMap map-keyword="北京" :map_visible="dialogMapVisible" @getMap="onEnlargeText" />
  </div>

</template>
<script>
import LxBaiduMap from '@/components/BaiduMap'

export default {
  components: {
    LxBaiduMap
  },
  data() {
    return {
      dialogMapVisible: true
    }
  },
  methods: {
    onEnlargeText: function(enlargeAmount) {
      console.log('经度', enlargeAmount.lng)
      console.log('纬度', enlargeAmount.lat)
      this.dialogMapVisible = false
    }
  }
}
</script>
