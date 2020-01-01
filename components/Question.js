function Question() {
	return {
		name: 'Question',
		template: `
			<div id="question">
				<h3 class="mt-5">提問區</h3>		
				<form class="qform">
					<div class="form-group">
						<label for="inputQuestion">回報問題</label>
						<textarea class="form-control" id="inputQuestion" rows="3" placeholder="請輸入要回報的問題" v-model="content"></textarea>
					</div>
					<div class="attachment-pool" v-if="files.length > 0 && showPreViewImg.length > 0">
						<div class="img border border-secondary rounded p-2 preview" 						
							v-for="(img,index) in showPreViewImg" 
							:style="'background-image:url('+img+')'" 
							@click="deletePreview"></div>
					</div>
					<div class="attachment-pool" v-if="files.length > 0 && showPreViewFile.length > 0">
						<div class="mr-2 border border-secondary rounded p-2 preview" v-for="(file, index) in showPreViewFile" @click="deletePreview">
							{{file}}
						</div>				
					</div>
					<div class="form-group text-right">						
						<label class="btn btn-outline-primary mb-0" for="uploadfiles">上傳附件</label>
						<input :type="inputType" ref="files" class="form-control-file" id="uploadfiles" @change="fileUpload" accept=".jpg,.png, .zip">
						<button class="btn btn-outline-success" @click.prevent="submitHandler">送出</button>
					</div>			  
				</form>
				<div class="mt-5">
					<ul class="text-secondary">
						<li>*附件可上傳jpg、png、zip</li>
						<li>若有多檔請打包成一個壓縮檔上傳</li>
					</ul>
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
				questionContent: '',
				files: [],
				inputFileType: 'file',
				preViewImg: [],
				preViewFile: []
			};
		},
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
			},
			showPreViewImg() {
				return this.preViewImg;
			},
			showPreViewFile() {
				return this.preViewFile;
			}
		},
		methods: {
			preViewImgHandler() {
				if (this.files.length > 0) {
					for (let i = 0; i < this.files.length; i++) {
						if (
							this.files[i].type !==
							'application/x-zip-compressed'
						) {
							let reader = new FileReader();
							reader.onload = e => {
								this.preViewImg.push(e.target.result);
							};
							reader.readAsDataURL(this.files[i]);
						} else {
							this.preViewFile.push(this.files[i].name);
						}
					}
				}
			},
			fileUpload() {
				// 上傳檔案
				let file = this.$refs.files.files;
				if (
					file[0].type === 'image/jpeg' ||
					file[0].type === 'image/png' ||
					file[0].type === 'application/x-zip-compressed'
				) {
					this.files = file;
				}
				this.inputFileType = 'text';
				setTimeout(() => {
					this.inputFileType = 'file';
				}, 500);
			},
			submitHandler() {
				const vm = this;
				if (this.questionContent === '') return;
				let question = JSON.stringify(formatStr(this.questionContent));
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
			},
			deletePreview() {
				this.files = [];
			}
		},
		watch: {
			files: {
				handler() {
					this.preViewImg = [];
					this.preViewFile = [];
					this.preViewImgHandler();
				}
			}
		}
	};

	function formatStr(str) {
		str = str.replace(/\'|\"/g, '');
		str = str.replace(/\r\n|\n/g, '');
		return str;
	}
}
