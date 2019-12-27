function Admin() {
	return {
		name: 'Admin',
		template: `
			<div id="admin">
				<router-link class="btn btn-outline-info" :class="{'active':!active}" to="admin">未答區</router-link>
				<router-link class="btn btn-outline-info" :class="{'active':active}" to="admin?answer=1">已回答</router-link>				
				<div v-if="mainData.length > 0">
					<answer v-for="data in mainData" 
						:answer="data" 
						:key="data.qid" 
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
				clearTimeout(timer);
				await this.getQuestions(n);
				await this.checkEditingHandler();
			},
			markQuestionHandler(qid) {
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
						this.checkEditingHandler();
					});
				}
			},
			startCheckEditing() {
				clearTimeout(timer);
				timer = setTimeout(() => {
					// this.checkEditingHandler();
					this.triggerRenew(this.active);
				}, 5000);
			},
			checkEditingHandler() {
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: { function: 'checkEditingHandler' }
				}).done(response => {
					response = JSON.parse(response);
					if (response.length > 0) this.editingData = response;
					this.startCheckEditing();
				});
			}
		},
		beforeRouteLeave(to, from, next) {
			clearTimeout(timer);
			next();
		},
		watch: {
			$route: {
				immediate: true,
				handler(newVal, oldVal) {
					clearTimeout(timer);
					let flag = newVal.query.answer ? true : false;
					this.active = flag;
					this.triggerRenew(flag);
					// this.getQuestions(flag);
					// this.checkEditingHandler();
				}
			},
			editingData: {
				handler(newVal, oldVal) {
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

var timer = null;
