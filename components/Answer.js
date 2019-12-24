function Answer() {
	return {
		name: 'Answer',
		template: `
          <div class="mt-3 px-3 pt-3 border rounded">
            <button class="btn btn-sm btn-info" data-toggle="collapse" :href="'#qid'+viewObj.qid">
              問題編號 {{viewObj.qid}}
            </button>
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
            <div class="collapse" :id="'qid'+viewObj.qid">
              <div class="alert clearfix" v-if="viewObj.answerflag === '0'">
                <textarea class="form-control" type="text" placeholder="請輸入回覆" v-model.trim="answerText"></textarea>
                <button class="btn btn-success mt-2 float-right" @click="submitHandler(viewObj.qid)">確定送出</button>
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
				answerText: ''
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
			viewObj() {
				let obj = {};
				obj = this.answer;
				obj['imgAttachment'] = obj.attachment.filter(
					el => el.indexOf('.png') !== -1 || el.indexOf('.jpg') !== -1
				);
				return obj;
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
			}
		}
	};
}
