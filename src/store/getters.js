const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  permission_routes: state => state.permission.routes,
  areaTree: state => {
    return JSON.parse(state.commonData.areaTree)
  },
  dics: (state) => (type, tagType) => {
    const dics = JSON.parse(state.commonData.dics)

    if (type && !tagType) {
      return dics.filter(item => (item.type === type))
    }
    if (tagType) {
      return dics.filter(item => (item.type === type && item.tagType.indexOf(tagType) >= 0))
    }

    return dics
  },
  commonFlag: state => state.commonData.commonFlag

}
export default getters
