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
						<input :type="inputType" ref="files" class="form-control-file" id="uploadfiles" @change="fileUpload" accept=".jpg,.png,.pdf" multiple>
						<button class="btn btn-outline-success" @click.prevent="submitHandler">送出</button>
					</div>			  
				</form>
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
				questionContent: '',
				files: [],
				inputFileType: 'file'
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
				return this.inputFileType;
			}
		},
		methods: {
			fileUpload() {
				this.files = this.$refs.files.files;
				this.inputFileType = 'text';
				setTimeout(() => {
					this.inputFileType = 'file';
				}, 500);
			},
			submitHandler() {
				const vm = this;
				if (this.questionContent === '') return;
				let question = JSON.stringify(
					this.questionContent.replace(/\r\n|\n/g, '')
				);
				let formData = new FormData();
				if (this.files.length > 0) {
					for (let i = 0; i < this.files.length; i++) {
						formData.append('file[]', this.files[i]);
					}
				}
				formData.append('function', 'askQuestionHandler');
				formData.append('userId', this.login.loginId);
				formData.append('question', question);
				let xhr = new XMLHttpRequest();
				xhr.open('POST', this.apiurl, true);
				xhr.onload = function() {
					if (xhr.status == 200) {
						vm.$router.push({ path: 'histories/all' });
					}
				};
				xhr.send(formData);
			}
		}
	};
}
