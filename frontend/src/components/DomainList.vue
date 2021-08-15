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
                <div class="col-md-6">
                  {{ domain.name }}
                </div>
                <div class="col-md-3">
                  <span
                    class="badge"
                    :class="{'bg-info': domain.available, 'bg-danger': !domain.available}"
                  >
                    {{ domain.available ? 'Disponível': 'Não disponível' }}
                  </span>
                </div>
                <div class="col-md-3 d-flex justify-content-end">
                  <a class="btn btn-info mx-1" :href="domain.checkout" target="_blank">
                    <i class="fa fa-shopping-cart"></i>
                  </a>
                  <button class="btn btn-info" @click="openDomain(domain)">
                    <span class="fa fa-search"></span>
                  </button>
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

import { mapState, mapActions } from 'vuex';
import AppItemList from './AppItemList.vue';

export default {
  name: 'DomainList',
  components: {
    AppItemList,
  },
  data: () => ({

  }),
  methods: {
    ...mapActions([
      'addItem',
      'deleteItem',
      'getItems',
      'generateDomains',
    ]),
    openDomain(domain) {
      this.$router.push({
        path: `/domains/${domain.name}`,
      });
    },
  },
  computed: {
    ...mapState(['items', 'domains']),
  },
};
</script>

<style scoped>

</style>
