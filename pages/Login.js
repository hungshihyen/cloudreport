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
      </div>
    
      `,
		props: {
			login: {
				type: Object,
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
				const params = new URLSearchParams();
				params.append('function', 'loginHandler');
				params.append('account', this.account);
				params.append('password', this.md5pwd);
				const response = await axios.post('./main.php', params, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});

				let { account, name, auth, response: flag } = response.data;
				if (flag === 1) {
					this.$emit('check-login', {
						account,
						auth,
						name
					});
					auth == 1
						? this.$router.push({ path: '/admin' })
						: this.$router.push({ path: '/users' });
				}
			},
			async checkloginHandler() {
				const params = new URLSearchParams();
				params.append('function', 'checkLogin');
				const response = await axios.post('./main.php', params, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					}
				});
				let { id, name, auth } = response.data;
				if (id && name) {
					this.$emit('check-login', {
						account: id,
						auth,
						name
					});
					auth === '0'
						? this.$router.push({ path: '/users' })
						: this.$router.push({ path: '/admin' });
				}
			}
		}
	};
}

var md5 = function(value) {
	return CryptoJS.MD5(value).toString();
};
