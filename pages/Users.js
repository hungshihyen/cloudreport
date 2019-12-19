var Users = {
	name: 'Users',
	template: `
		<div>
			<router-link class="btn btn-outline-warning" to="/users/question">提問區</router-link>
			<router-link class="btn btn-outline-warning" to="/users/histories">回覆區</router-link>
			<component class="mt-2" :is="componentPage" :login="login"></component>
		</div>`,
	props: {
		login: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			componentPage: ''
		};
	},
	mounted() {
		let page = this.$route.params.page;
		this.componentPage = page;
	},
	watch: {
		$route(to, from) {
			let page = to.params.page;
			this.componentPage = page;
		}
	},
	components: { Histories, Question }
};
