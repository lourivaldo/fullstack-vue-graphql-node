<template>
  <div>
    <h5>{{ title }} <span class="badge bg-info">{{ items.length }}</span></h5>
    <div class="card">
      <div class="card-body">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center"
              v-for="item in items"
              :key="item.id"
          >
            <div>{{ item.description }}</div>
            <button class="btn btn-info d-inline-block" @click="deleteItem(item)">
              <span class="fa fa-trash"></span>
            </button>
          </li>
        </ul>
        <br>
        <div class="input-group">
          <input class="form-control"
                 v-model="description" type="text"
                 placeholder="Digite o item"
                 @keyup.enter="addItem(type, description)"
          />
          <div class="input-group-append">
            <button class="btn btn-info" @click="addItem(type, description)">
              <span class="fa fa-plus"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppItemList',
  props: {
    items: Array,
    title: String,
    type: String,
  },
  data: () => ({
    description: '',
  }),
  methods: {
    addItem(type, description) {
      this.$emit('addItem', { type, description });
      this.description = '';
    },
    deleteItem(item) {
      this.$emit('deleteItem', item);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
