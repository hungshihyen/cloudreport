function Question() {
  return {
    name: 'Question',
    template: `
		  <div id="question">
			  <h3 class="mt-3">提問區</h3>		
			  <form class="qform">
				  <div class="form-group">
					  <label for="inputQuestion">回報問題</label>
					  <textarea class="form-control" id="inputQuestion" rows="3" placeholder="請輸入要回報的問題" v-model="content"></textarea>
				  </div>
				  <div class="form-group text-right">
					  <label class="btn btn-outline-primary mb-0" for="uploadfiles">上傳附件</label>
					  <input :type="inputType" ref="files" class="form-control-file" id="uploadfiles" @change="fileUpload">
					  <button class="btn btn-outline-success" @click.prevent="submitHandler">送出</button>
				  </div>			  
			  </form>
		  </div>`,
    props: {
      login: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        questionContent: '',
        files: []
      };
    },
    mounted() {},
    computed: {
      content: {
        get() {
          return this.questionContent;
        },
        set(val) {
          this.questionContent = val.trim();
        }
      },
      inputType() {
        return this.files.length === 0 ? 'file' : 'text';
      }
    },
    methods: {
      fileUpload() {
        this.files = this.$refs.files.files;
      },
      submitHandler() {
        if (this.questionContent === '') return;
        console.log(this.files, this.questionContent);
      }
    }
  };
}
