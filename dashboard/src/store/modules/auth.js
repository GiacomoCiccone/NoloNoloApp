//store/modules/auth.js

import axios from 'axios';
const state = {
    user: null,
    posts: null,
};
const getters = {

};
const actions = {
    async LogIn({commit}, User) {
        await axios.post('login', User)
        await commit('setUser', User.get('username'))
    },
};
const mutations = {

};
export default {
  state,
  getters,
  actions,
  mutations
};
