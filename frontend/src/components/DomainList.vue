<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md">
          <app-item-list
            title="Prefixos"
            type="prefix"
            :items="items.prefix"
            @addItem="addItem"
            @deleteItem="deleteItem"
          />
        </div>
        <div class="col-md">
          <app-item-list
            title="Sufixos"
            type="suffix"
            :items="items.suffix"
            @addItem="addItem"
            @deleteItem="deleteItem"
          />
        </div>
      </div>
      <br>
      <h5>Domains <span class="badge bg-info">{{ domains.length }}</span></h5>
      <div class="card">
        <div class="card-body">
          <ul class="list-group">
            <li class="list-group-item" v-for="domain in domains" :key="domain.name">
              <div class="row">
                <div class="col-md">
                  {{ domain.name }}
                </div>
                <div class="col-md">
                  <a class="btn btn-info pull-right" :href="domain.checkout" target="_blank">
                    <i class="fa fa-shopping-cart"></i>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import axios from 'axios';

import AppItemList from './AppItemList.vue';

export default {
  name: 'App',
  components: {
    AppItemList,
  },
  data: () => ({
    items: {
      prefix: [],
      suffix: [],
    },
  }),
  methods: {
    addItem(item) {
      console.log('item', item);
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
          console.log(newItem);
          this.items[item.type].push(newItem);
        });
    },
    deleteItem(item) {
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
          this.getItems(item.type);
        });
    },
    getItems(type) {
      axios({
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
          this.items[type] = items;
        });
    },
  },
  computed: {
    domains() {
      const domains = [];
      for (const prefix of this.items.prefix) {
        for (const suffix of this.items.suffix) {
          const name = prefix.description + suffix.description;
          const url = name.toLowerCase();
          const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com`;
          domains.push({
            name,
            checkout,
          });
        }
      }
      return domains;
    },
  },
  created() {
    this.getItems('prefix');
    this.getItems('suffix');
  },
};
</script>

<style scoped>

</style>
