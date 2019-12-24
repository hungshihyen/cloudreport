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
					></answer>		
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
				Qary: []
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
				let str = `answerflag = ${n ? '1' : '0'}`;
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: {
						function: 'getQuestions',
						userId: this.login.loginId,
						conditions: str
					}
				}).done(response => {
					response = JSON.parse(response);
					this.Qary = response;
				});
			},
			triggerRenew(n) {
				this.getQuestions(n);
			}
		},
		watch: {
			$route: {
				immediate: true,
				handler(newVal, oldVal) {
					let flag = newVal.query.answer ? true : false;
					this.getQuestions(flag);
					this.active = flag;
				}
			}
		}
	};
}
