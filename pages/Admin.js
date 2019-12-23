function Admin() {
  return {
    name: 'Admin',
    template: `
      <div>
        <h1>管理者</h1>
        <answer />
      </div>`,
    props: {
      login: {
        type: Object,
        required: true
      }
    },
    components: { Answer: Answer() }
  };
}
