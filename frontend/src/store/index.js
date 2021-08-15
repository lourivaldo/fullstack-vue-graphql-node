import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state() {
    return {
      items: {
        prefix: [],
        suffix: [],
      },
      domains: [],
    };
  },
  mutations: {
    addItem(state, { item, newItem }) {
      state.items[item.type].push(newItem);
    },
    deleteItem(state, item) {
      state.items[item.type].splice(state.items[item.type].indexOf(item), 1);
    },
    setItems(state, { type, items }) {
      state.items[type] = items;
    },
    setDomains(state, { domains }) {
      state.domains = domains;
    },
  },
  actions: {
    async addItem({ dispatch, commit }, item) {
      axios({
        url: 'http://localhost:4000',
        method: 'post',
        data: {
          query: `
            mutation ($item: ItemInput) {
              newItem: saveItem(item: $item) {
                id
                type
                description
              }
            }
          `,
          variables: {
            item,
          },
        },
      })
        .then((response) => {
          const { newItem } = response.data.data;
          commit('addItem', { item, newItem });
          dispatch('generateDomains');
        });
    },
    async deleteItem({ commit, dispatch }, item) {
      axios({
        url: 'http://localhost:4000',
        method: 'post',
        data: {
          query: `
            mutation ($id: Int) {
              deleted: deleteItem(id: $id)
            }
          `,
          variables: {
            id: item.id,
          },
        },
      })
        .then(() => {
          commit('deleteItem', item);
          dispatch('generateDomains');
        });
    },
    async getItems({ commit }, type) {
      return axios({
        url: 'http://localhost:4000',
        method: 'post',
        data: {
          query: `
            query ($type: String) {
              items: items (type: $type) {
                id
                type
                description
              }
            }
          `,
          variables: {
            type,
          },
        },
      })
        .then((response) => {
          const { items } = response.data.data;
          commit('setItems', { type, items });
        });
    },
    async generateDomains({ commit }) {
      axios({
        url: 'http://localhost:4000',
        method: 'post',
        data: {
          query: `
            mutation {
              domains: generateDomains {
                name
                checkout
                available
              }
            }
          `,
        },
      })
        .then((response) => {
          const { domains } = response.data.data;
          commit('setDomains', { domains });
        });
    },
  },
});

Promise.all([
  store.dispatch('getItems', 'prefix'),
  store.dispatch('getItems', 'suffix'),
]).then(() => {
  store.dispatch('generateDomains');
});

export default store;
