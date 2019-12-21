function Histories() {
  return {
    name: 'Histories',
    template: `
      <div>
        <h3 class="mt-3">歷史問題區</h3>
        <div class="mt-3 row">
          <history v-for="item in showData" :key="item"/>		
        </div>				
      </div>`,
    components: { History: History() },
    props: {
      login: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        Qary: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      };
    },
    mounted() {},
    computed: {
      showData: {
        get() {
          return this.qid === 'all' ? this.Qary : this.Qary[this.qid];
        }
      },
      qid: {
        get() {
          return this.$route.params.qid;
        }
      }
    }
  };
}
