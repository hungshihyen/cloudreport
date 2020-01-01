function Admin() {
	let timer = null;
	return {
		name: 'Admin',
		template: `
			<div id="admin">
				<router-link class="btn btn-outline-info" :class="{'active':!active}" to="admin">未答區</router-link>
				<router-link class="btn btn-outline-info" :class="{'active':active}" to="admin?answer=1">已回答</router-link>				
				<div v-if="mainData.length > 0">
					<answer v-for="obj in mainData" 
						:answer="obj" 
						:key="obj.qid" 
						:login="login" 
						:apiurl="apiurl"
						@answer-renew="triggerRenew"
						@mark-question="markQuestionHandler"
					></answer>		
				</div>
				<div class="mt-3" v-else>
					尚無資料
				</div>				
			</div>`,
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
				active: '',
				Qary: [],
				editing: {
					flag: false,
					qid: ''
				},
				editingData: []
			};
		},
		components: { answer: Answer() },
		computed: {
			mainData() {
				return this.Qary.length > 0 ? this.Qary : [];
			}
		},
		methods: {
			getQuestions(n) {
				// 取資料
				let conditions = n ? '1' : '0';
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: {
						function: 'getQuestions',
						userId: this.login.loginId,
						conditions
					}
				}).done(response => {
					response = JSON.parse(response);
					this.Qary = response;
				});
			},
			async triggerRenew(n) {
				// 更新資料
				clearTimeout(timer);
				await this.getQuestions(n);
				this.startCheckEditing();
			},
			markQuestionHandler(qid) {
				// 設定answermark
				clearTimeout(timer);
				if (!this.editing.flag && this.editing.qid === '') {
					this.editing.flag = true;
					this.editing.qid = qid;
				} else if (this.editing.flag && this.editing.qid !== qid) {
					this.editing.qid = qid;
				} else {
					this.editing.qid = '';
					this.editing.flag = false;
				}
				this.setQuestionMarkHandler();
			},
			setQuestionMarkHandler() {
				// answermark寫入db
				if (this.editing.flag) {
					$.ajax({
						url: this.apiurl,
						type: 'post',
						data: {
							function: 'setQuestionMarkHandler',
							userId: this.login.loginId,
							qid: this.editing.qid
						}
					}).done(() => {
						this.triggerRenew(this.active);
					});
				}
			},
			startCheckEditing() {
				// set timer
				clearTimeout(timer);
				timer = setTimeout(() => {
					this.triggerRenew(this.active);
				}, 5000);
			}
		},
		beforeRouteLeave(to, from, next) {
			// 離開這個畫面前清除 timer，不然會繼續
			clearTimeout(timer);
			next();
		},
		watch: {
			// 偵測路由
			$route: {
				immediate: true,
				handler(newVal) {
					clearTimeout(timer);
					let flag = newVal.query.answer ? true : false;
					this.active = flag;
					this.triggerRenew(flag);
				}
			},
			// 偵測editingData的變化，一變化就觸發
			editingData: {
				handler(newVal) {
					this.Qary.reduce((prev, curr) => {
						curr.editing = '';
						newVal.forEach(el => {
							if (curr.qid === el.qid) curr.editing = el.eidtor;
						});
						prev.push(curr);
						return prev;
					}, []);
				}
			}
		}
	};
}
