<template>
  <el-dialog ref="MapDialog" :visible.sync="mapVisible" @close="$emit('handleClose')" lock-sroll="false" class="abow_dialog" width="100%">

    <div class="map-container">
      <label>关键词：<input v-model="mapKeyword"></label>
      <label>经度：{{ this.center.lng }}    纬度：{{ this.center.lat }}</label>

      <baidu-map class="bm-view" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" @click="getClickInfo">
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
        <bm-view class="map" />
        <bm-local-search :keyword="mapKeyword" :auto-viewport="true" />
        <bm-marker :position="{lng: this.center.lng, lat: this.center.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
          <bm-label content="" :label-style="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}" />
        </bm-marker>
        <bm-copyright
          anchor="BMAP_ANCHOR_TOP_RIGHT"
          :copyright="[{id: 1, content: 'Copyright Message', bounds: {ne: {lng: 110, lat: 40}, sw:{lng: 0, lat: 0}}}, {id: 2, content: '<a>:楼讯网</a>'}]"
        />
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />

      </baidu-map>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('getMap',center)">确定坐标</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'LxBaiduMap',
  props: {
    mapKeyword: {
      type: String,
      default: () => { return '' }
    },
    mapVisible: {
      type: Boolean,
      default: () => { return false }

    },
    center: {
      type: Object,
      default: () => { return { lng: 114.064543, lat: 22.548427 } }

    }
  },
  data: function() {
    return {
      zoom: 3
    }
  },
  methods: {
    handler({ BMap, map }) {
      this.zoom = 15
    },
    getClickInfo(e) {
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    }

  }
}
</script>
<style>
  .bm-view {
    width: 100%;
    height: 500px;
  }
  .map-container > div >div{
    height:  500px;
  }
</style>
