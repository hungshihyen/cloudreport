function Users() {
  return {
    name: 'Users',
    template: `
      <div>
        <router-link class="btn btn-outline-warning" to="/question">提問區</router-link>
        <router-link class="btn btn-outline-warning" to="/histories/all">回覆區</router-link>
        <router-view :login="login"></router-view>	
      </div>`,
    props: {
      login: {
        type: Object,
        required: true
      }
    },
    data() {
      return {};
    },
    mounted() {},
    watch: {},
    components: { Histories: Histories(), Question: Question() }
  };
}
