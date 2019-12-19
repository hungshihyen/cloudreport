var router = new VueRouter({
	// mode: 'history',
	// base: '/',
	routes: [
		{ path: '/admin', component: Admin },
		{
			path: '/users/:page',
			name: 'users',
			component: Users,
			children: [
				{
					path: 'question',
					name: 'question',
					component: Question
				},
				{
					path: 'histories/:qid',
					name: 'histories',
					component: Histories
				}
			]
		},
		{
			path: '*',
			redirect: '/login'
		}
	]
});

var app = new Vue({
	el: '#app',
	router,
	data: {
		login: {
			loginName: '',
			auth: 0,
			loginId: ''
		}
	},
	mounted() {}
});
