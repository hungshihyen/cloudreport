function Answer() {
	return {
		name: 'Answer',
		template: `
			<div class="mt-3 px-3 pt-3 border rounded">
				<button 
					class="btn btn-sm btn-info" 
					data-toggle="collapse" 
					:disabled="editingDisabled"
					:href="'#qid'+viewObj.qid" 
					@click.prevent="markQuestionHandler(viewObj.qid)"
				>
					問題編號 {{viewObj.qid}}
				</button>
				<span class="ml-3 text-danger" v-show="editingDisabled && viewObj.answerflag === '0'">{{viewObj.editing}} 正在編輯</span>
				<p class="mt-3">
					{{viewObj.question}}
					<div class="attachment-pool" v-show="imgInclude">
						<div class="img" 
							v-for="(img,index) in viewObj.imgAttachment" 
							:key="index" 
							:style="'background-image:url('+img+')'"
							@mouseover="imgHoverInHandler(img)" 
							@mouseleave="imgHoverOutHandler"
						>
							<img class="imgHover mb-5" v-show="imgInhance === img" :src="img" />
						</div>              
					</div>
				</p>
				<div class="collapse mb-3" :id="'qid'+viewObj.qid">
					<div class="alert clearfix" v-if="viewObj.answerflag === '0'">
						<textarea class="form-control" type="text" placeholder="請輸入回覆" v-model.trim="answerText"></textarea>
						<button class="btn btn-success mt-2 ml-2 float-right" @click="submitHandler(viewObj.qid)">確定送出</button>
						<button class="btn btn-secondary mt-2 float-right" @click="cancelAnswerHandler(viewObj.qid)">取消</button>
					</div>              
					<div class="card card-body" v-if="viewObj.answerflag === '1'">
						<div class="alert">
						<span>{{viewObj.responder}}</span> 回覆：{{viewObj.response}}                  
						</div>
					</div>
				</div>
			</div>
      	`,
		props: {
			answer: {
				type: Object,
				required: true
			},
			login: {
				type: Object,
				required: true
			},
			apiurl: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				reply: {
					text: ''
				},
				imgInhance: '',
				answerText: '',
				editingDisabled: false
			};
		},
		computed: {
			imgInclude() {
				return (
					this.answer &&
					this.answer.attachment.length > 0 &&
					this.answer.attachment.reduce((prev, curr) => {
						prev ||
						curr.indexOf('.png') !== -1 ||
						curr.indexOf('.jpg') !== -1
							? (prev = true)
							: (prev = false);
						return prev;
					}, false)
				);
			},
			viewObj: {
				get() {
					let obj = {};
					obj = this.answer;
					this.editingDisabled = false;
					if (obj.editing !== '' && obj.answerflag === '0') {
						this.editingDisabled = true;
						obj.editing === this.login.loginName
							? $(`#qid${obj.qid}`).collapse('show')
							: '';
					}
					obj['imgAttachment'] = obj.attachment.filter(
						el =>
							el.indexOf('.png') !== -1 ||
							el.indexOf('.jpg') !== -1
					);
					return obj;
				}
			}
		},
		methods: {
			imgHoverInHandler(img) {
				this.imgInhance = img;
			},
			imgHoverOutHandler() {
				this.imgInhance = '';
			},
			submitHandler(qid) {
				if (this.answerText) {
					$.ajax({
						url: this.apiurl,
						type: 'post',
						data: {
							function: 'answerQuestionHandler',
							qid,
							response: JSON.stringify(this.answerText),
							responder: this.login.loginId
						}
					}).done(res => {
						let n = this.viewObj.answerflag === '1' ? true : false;
						this.$emit('answer-renew', n);
					});
				}
			},
			markQuestionHandler(qid) {
				if (this.viewObj.answerflag === '0') {
					this.$emit('mark-question', qid);
				}
				return;
			},
			cancelAnswerHandler(qid) {
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: { function: 'cancelAnswerHandler', qid }
				}).done(res => {
					let n = this.viewObj.answerflag === '1' ? true : false;
					this.$emit('answer-renew', n);
					this.markQuestionHandler(qid);
				});
			}
		}
	};
}
