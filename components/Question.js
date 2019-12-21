function Question() {
  return {
    name: 'Question',
    template: `
		  <div>
			  <h3 class="mt-3">提問區</h3>		
			  <form class="qform">
				  <div class="form-group">
					  <label for="inputQ">回報問題</label>
					  <textarea class="form-control" id="inputQ" rows="3" placeholder="請輸入要回報的問題"></textarea>
				  </div>
				  <div class="form-group text-right">
					  <label class="btn btn-outline-primary mb-0" for="uploadfiles">上傳附件</label>
					  <input type="file" class="form-control-file" id="uploadfiles">
					  <button class="btn btn-outline-success" @click.prevent>送出</button>
				  </div>
			  
			  </form>
  
		  </div>`,
    props: {
      login: {
        type: Object,
        required: true
      }
    },
    mounted() {}
  };
}
