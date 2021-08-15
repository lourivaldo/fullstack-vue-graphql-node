<template>
  <div class="container">
    <div class="text-left">
      <router-link to="/domains">Voltar</router-link>
      <br>
      <h2>{{ domain }}</h2>
      <div class="card">
        <div class="card-body">
          <ul class="list-group">
            <li class="list-group-item" v-for="domain in domains" :key="domain.name">
              <div class="row">
                <div class="col-md-6">
                  {{ domain.extension }}
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

export default {
  name: 'DomainView',
  components: {},
  props: ['domain'],
  data() {
    return {
      domains: [],
    };
  },
  created() {
    axios({
      url: 'http://localhost:4000',
      method: 'post',
      data: {
        query: `
          mutation ($name: String) {
            domains: generateDomain(name: $name) {
              name
              extension
              checkout
              available
            }
          }
          `,
        variables: {
          name: this.domain,
        },
      },
    })
      .then((response) => {
        const { domains } = response.data.data;
        this.domains = domains;
      });
  },
};
</script>

<style scoped>

</style>
