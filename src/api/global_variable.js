// const baseUrl = 'http://10.1.220.5:9090/service-house'
const baseUrl = process.env.VUE_APP_BASE_API + '/service-house'
const dic = {
  type: {
    // 楼盘标签
    tag: 3,
    // 物业类型
    propertyType: 1,
    // 朝向
    orientedType: 14,
    // 装修
    decorationType: 23,
    // 备案号状态
    registerStatus: 28,
    // 房屋结构
    Structural: 24
  },
  tagType: {
    // 新房
    newHouse: 31,
    // 二手房
    usedHouse: 32,
    // 租房
    renting: 33,
    // 房屋结构
    Structural: 241
  }
}

const dicTypes = [{ name: '物业类型', type: 1 },
  { name: '建筑类型', type: 2 },
  { name: '电梯属性', type: 5 },
  { name: '供水电性质', type: 6 },
  { name: '供暖性质', type: 8 },
  { name: '供气性质', type: 9 },
  { name: '销售状态', type: 10 },
  { name: '房源类型', type: 11 },
  { name: '楼层类型', type: 12 },
  { name: '房屋朝向', type: 14 },
  { name: '经纪公司', type: 15 },
  { name: '房龄', type: 17 },
  { name: '均价配置', type: 18 },
  { name: '总价配置', type: 19 },
  { name: '面积配置', type: 20 },
  { name: '房型配置', type: 21 },
  { name: '装修图', type: 22 },
  { name: '装修', type: 23 },
  { name: '楼盘标签', type: 3 },
  { name: '产权年限', type: 26 },
  { name: '户型标签', type: 24 },
  { name: '房源类型', type: 27 },
  { name: '房屋备案状态', type: 28 },
  { name: '房屋属性', type: 29 }

]

export default {
  dic,
  dicTypes,
  baseUrl
}

