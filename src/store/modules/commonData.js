import { treeByCode } from '@/api/area'
import { getListByType } from '@/api/dic'

const state = {
  areaTree: getCommonData('areaTree'),
  dics: getCommonData('dics'),
  // 数据刷新标记
  commonFlag: false
}

const mutations = {
  setAreaTree: (state, areaTree) => {
    state.areaTree = areaTree
  },
  setDics: (state, dics) => {
    state.dics = dics
  },

  setCommonFlag: (state, commonFlag) => {
    state.commonFlag = commonFlag
  }

}
const actions = {
  removeClean({ commit, state }) {
    commit('setCommonFlag', '')
  },
  getCityTree({ commit, state }) {
    return new Promise((resolve, reject) => {
      treeByCode({ code: 0, depth: 3, startLevek: 1 }).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('setAreaTree', JSON.stringify(data))


        setCommonData('areaTree', JSON.stringify(data))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDics({ commit, state }) {
    return new Promise((resolve, reject) => {
      getListByType().then(response => {

        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        commit('setDics', JSON.stringify(data))
        setCommonData('dics', JSON.stringify(data))
        commit('setCommonFlag', true)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

function getCommonData(dataType) {
  return localStorage.getItem(dataType)
}

function setCommonData(dataType, data) {
  return localStorage.setItem(dataType, data)
}
