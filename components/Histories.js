function Histories() {
	return {
		name: 'Histories',
		template: `
      <div>
        <h3 class="mt-3">歷史問題區</h3>
        <div class="mt-3 row">
          <history v-for="item in showData" :key="item.qid" :question="item" @viewQuestion="viewQuestion"/>
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
                <div class="alert alert-secondary">問題：{{viewObj.question}}</div>
                <div class="alert alert-success" v-if="viewObj.answerflag === '1'">
                  <div>回覆者：{{viewObj.responder}}</div>
                  <div>內容：{{viewObj.response}}</div>
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
			}
		},
		data() {
			return {
				Qary: [],
				modalShown: false,
				viewQid: ''
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
					? this.showData.filter(el => el.qid === this.viewQid)[0]
					: false;
			}
		},
		methods: {
			async getQuestions() {
				const params = new URLSearchParams();
				params.append('function', 'getQuestions');
				params.append('userId', this.login.loginId);
				const response = await axios.post('./main.php', params, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
				console.log(response.data);
				response.data.length > 0
					? (this.Qary = response.data)
					: (this.Qary = []);
			},
			viewQuestion(qid) {
				this.viewQid = qid;
				$('#historiesModal').modal('show');
			}
		}
	};
}
