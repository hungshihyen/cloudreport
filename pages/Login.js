function Login() {
	return {
		name: 'login',
		template: `
			<div class="row">
				<form class="col-sm-6 mx-auto mt-5 form-signin text-center">        
					<h1 class="h3 mb-3 font-weight-normal text-left">請登入</h1>      
					<input type="text" id="account" class="form-control my-3" placeholder="account" required v-model.trim="account">       
					<input type="password" id="password" class="form-control my-3" placeholder="password" required v-model.trim="password">
					<button class="btn btn-primary" type="submit" @click.prevent="loginHandler">Sign in</button>       
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
				account: '',
				password: ''
			};
		},
		mounted() {
			this.checkloginHandler();
		},
		computed: {
			md5pwd: {
				get() {
					return btoa(this.password);
				}
			}
		},
		methods: {
			async loginHandler() {
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: {
						function: 'loginHandler',
						account: this.account,
						password: this.md5pwd
					}
				}).done(response => {
					let { account, name, auth, response: flag } = JSON.parse(
						response
					);
					if (flag === 1) {
						this.$emit('check-login', {
							account,
							auth,
							name
						});
						this.pathHandler(auth);
					}
				});
			},
			async checkloginHandler() {
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: { function: 'checkLogin' }
				}).done(response => {
					let { id, name, auth } = JSON.parse(response);
					if (id && name) {
						this.$emit('check-login', {
							account: id,
							auth,
							name
						});
						this.pathHandler(auth);
					}
				});
			},
			pathHandler(auth) {
				auth == 1
					? this.$router.push({ path: '/admin' })
					: this.$router.push({ path: '/users' });
			}
		}
	};
}

var md5 = function(value) {
	return CryptoJS.MD5(value).toString();
};
