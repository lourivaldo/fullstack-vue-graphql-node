<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md">
          <app-item-list
            title="Prefixos"
            :items="prefixes"
            @addItem="addPrefix"
            @deleteItem="deletePrefix"
          />
        </div>
        <div class="col-md">
          <app-item-list
            title="Sufixos"
            :items="suffixes"
            @addItem="addSuffix"
            @deleteItem="deleteSuffix"
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

import AppItemList from './AppItemList.vue';

export default {
  name: 'App',
  components: {
    AppItemList,
  },
  data: () => ({
    prefixes: ['Air', 'Jet', 'Flight'],
    suffixes: ['Hub', 'Station', 'Mart'],
  }),
  methods: {
    addPrefix(prefix) {
      this.prefixes.push(prefix);
    },
    addSuffix(suffix) {
      this.suffixes.push(suffix);
    },
    deletePrefix(prefix) {
      this.prefixes.splice(this.prefixes.indexOf(prefix), 1);
    },
    deleteSuffix(suffix) {
      this.suffixes.splice(this.prefixes.indexOf(suffix), 1);
    },
  },
  computed: {
    domains() {
      const domains = [];
      for (const prefix of this.prefixes) {
        for (const suffix of this.suffixes) {
          const name = prefix + suffix;
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
};
</script>

<style scoped>

</style>
