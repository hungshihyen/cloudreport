function Users() {
  return {
    name: 'Users',
    template: `
      <div id="users">
        <router-link class="btn btn-outline-warning" :class="{'active':active === 'question'}" to="/question">提問區</router-link>
        <router-link class="btn btn-outline-warning" :class="{'active':active === 'histories'}" to="/histories/all">回覆區</router-link>
        <transition name="fade" mode="out-in" appear>
          <router-view :login="login"></router-view>	
        </transition>
      </div>`,
    props: {
      login: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        active: ''
      };
    },
    mounted() {},
    watch: {
      $route: {
        immediate: true,
        handler(newVal, oldVal) {
          this.active = newVal.name;
        }
      }
    }
  };
}
