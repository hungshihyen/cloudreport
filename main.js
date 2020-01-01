(async () => {
	var router = new VueRouter({
		// mode: 'history',
		// base: '/',
		routes: [
			{
				path: '',
				component: Users(),
				meta: { loginflag: true },
				children: [
					{
						path: '',
						redirect: 'users'
					},
					{
						path: 'users',
						name: 'question',
						component: Question(),
						meta: { loginflag: true }
					},
					{
						path: 'histories/:qid',
						name: 'histories',
						component: Histories(),
						meta: { loginflag: true }
					}
				]
			},
			{
				path: '/admin',
				name: 'admin',
				component: Admin(),
				meta: { loginflag: true, auth: true }
			},
			{
				path: '/login',
				name: 'login',
				component: Login()
			},
			{
				path: '*',
				redirect: '/users'
			}
		]
	});

	router.beforeEach(async (to, from, next) => {
		await Vue.nextTick();
		if (to.name !== 'login' && to.meta.loginflag) {
			app.login.loginId !== '' ? next() : next({ path: '/login' });
		} else {
			next();
		}
	});

	var app = new Vue({
		el: '#app',
		router,
		data: {
			login: {
				loginName: '',
				auth: 0,
				loginId: ''
			},
			apiurl: './main.php',
			siteStatusflag: ''
		},
		mounted() {
			this.siteStatus(); // 站台、db連線狀態
			this.getStatus(); // 觸發timer
		},
		computed: {
			loginName: {
				get() {
					return this.login.loginName;
				}
			},
			status: {
				get() {
					return this.siteStatusflag;
				}
			}
		},
		methods: {
			checkLogin({ account, name, auth }) {
				this.login.loginId = account;
				this.login.loginName = name;
				this.login.auth = auth * 1;
			},
			logoutHandler() {
				// const params = new URLSearchParams();
				// params.append('function', 'logoutHandler');
				// await axios.post('./main.php', params, {
				// 	headers: {
				// 		'content-type': 'application/x-www-form-urlencoded'
				// 	}
				// });
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: { function: 'logoutHandler' }
				}).done(() => {
					this.checkLogin({ account: '', name: '', auth: 0 });
					this.$router.push({ path: '/login' });
				});
			},
			siteStatus() {
				$.ajax({
					url: this.apiurl,
					type: 'post',
					data: { function: 'siteStatus' }
				}).done(res => {
					this.siteStatusflag = res === '1' ? true : false;
				});
			},
			getStatus() {
				setInterval(() => {
					this.siteStatus();
				}, 10000);
			}
		}
	});
})();
