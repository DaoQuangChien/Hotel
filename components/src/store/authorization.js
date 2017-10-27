import mutationTypes from './mutation-types'

// initial state
const state = {
  user: null
}

// getters
const getters = {
  user: state => state.user
}

// actions
const actions = {
  async login ({ commit }) {
    var user = {}
    commit(mutationTypes.LOGIN_SUCCESS, user)
    return true
  }
}

// mutations
const mutations = {
  [mutationTypes.AUTH_RESET] (state) {
    state.user = null
  },

  [mutationTypes.LOGIN_SUCCESS] (state, user) {
    state.user = user
  },

  [mutationTypes.LOGIN_FAILURE] (state) {
    state.user = null
  }
}

export default {
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
}
