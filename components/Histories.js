function Histories() {
	return {
		name: 'Histories',
		template: `
			<div>
				<h3 class="mt-3">歷史問題區</h3>
				<div class="mt-3 row" v-if="showData.length > 0">
					<history v-for="item in showData" :key="item.qid" :question="item" @viewQuestion="viewQuestion"/>
				</div>
				<div class="mt-3" v-else>
					尚無問題
				</div>
				<div class="modal fade" id="historiesModal" tabindex="-1" role="dialog">
					<div class="modal-dialog modal-lg" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalCenterTitle">問題編號 {{viewObj.qid}}</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body">
								<div class="alert alert-secondary">
									<span>問題：{{viewObj.question}}</span>
									<div class="attachment-pool mt-3">								
										<div class="img" v-for="(img,index) in viewObj.imgAttachment" 
											:style="'background-image:url('+img+')'" 
											@mouseover="imgHoverInHandler(index)" 
											@mouseleave="imgHoverOutHandler"
											>
											<img class="imgHover" v-show="imgInhanceIndex === index" :src="img"/>
										</div>
									</div>
								</div>
								<div class="alert alert-success" v-if="viewObj.answerflag === '1'">
									<div>{{viewObj.responder}} 回覆： {{viewObj.response}}</div>
									
								</div>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal">完成</button>                
							</div>
						</div>
					</div>
				</div>	
			</div>`,
		components: { History: History() },
		props: {
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
				Qary: [],
				modalShown: false,
				viewQid: '',
				imgInhanceIndex: '',
				keepHoverImgflag: false
			};
		},
		async mounted() {
			await this.getQuestions();
		},
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
			},
			viewObj() {
				return this.viewQid !== ''
					? this.showData
							.filter(el => el.qid === this.viewQid)
							.reduce((prev, curr) => {
								prev = curr;
								prev['imgAttachment'] = curr.attachment.filter(
									el =>
										el.indexOf('.jpg') !== -1 ||
										el.indexOf('.png') !== -1
								);
								return prev;
							}, {})
					: false;
			}
		},
		methods: {
			async getQuestions() {
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: {
						function: 'getQuestions',
						userId: this.login.loginId
					}
				}).done(response => {
					response = JSON.parse(response);
					console.log(response);
					response.length > 0
						? (this.Qary = response)
						: (this.Qary = []);
				});
			},
			viewQuestion(qid) {
				this.viewQid = qid;
				$('#historiesModal').modal('show');
			},
			imgHoverInHandler(index) {
				this.imgInhanceIndex = index;
			},
			imgHoverOutHandler() {
				this.imgInhanceIndex = '';
			}
		}
	};
}
