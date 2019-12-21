function Login() {
  return {
    name: 'login',
    template: `
      <div class="row">
          <form class="col-sm-6 mx-auto mt-5 form-signin text-center">        
              <h1 class="h3 mb-3 font-weight-normal text-left">請登入</h1>      
              <input type="text" id="account" class="form-control my-3" placeholder="account" required >       
              <input type="password" id="password" class="form-control my-3" placeholder="password" required>        
              <button class="btn btn-primary" type="submit">Sign in</button>       
          </form>
      </div>
    
      `,
    props: {
      login: {
        type: Object,
        required: true
      }
    }
  };
}
