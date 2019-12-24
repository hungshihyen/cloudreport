function History() {
	return {
		name: 'History',
		template: `
			<div class="col-sm-4 mb-2">
				<div class="card">
					<div class="card-body">
						<span class="pin float-right text-success" v-show="pin"><i class="fa fa-check-circle fa-lg" aria-hidden="true"></i></span>
						<h5 class="card-title">問題編號 {{question.qid}}</h5>
						<h6 class="card-subtitle mb-2" :class="{'text-success':pin, 'text-muted':!pin}">{{pin?'已回答':'未回答'}}</h6>
						<p class="card-text">{{question.question}}</p>
						<a href="javascript:;" class="card-link btn btn-info" @click="viewDetail">檢視</a>
						<span class="ml-2" v-if="question.attachment.length > 0">
							<a :href="file" class="card-link" v-for="(file, i) in question.attachment" :download="'附件'+(i+1)">附件{{i+1}}</a>
						</span>						
					</div>
				</div>
			</div>`,
		props: {
			question: {
				type: Object,
				required: true
			}
		},
		computed: {
			pin() {
				return this.question.answerflag === '0' ? false : true;
			}
		},
		methods: {
			viewDetail() {
				this.$emit('viewQuestion', this.question.qid);
			}
		}
	};
}
