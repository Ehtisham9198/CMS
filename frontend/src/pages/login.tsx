import React from 'react'

const login = () => {
    const SubmitHandler=  async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        const response = await fetch('/login',{
            
        })
    }
  return (
    <div>
    <form onSubmit={SubmitHandler}>
      <label htmlFor="email">Email</label> <br />
      <input name='email' type="email" id='email' required /> <br />
      <label htmlFor="password">Enter Password</label> <br />
      <input name='password' type="password" id='password' required /> <br />
      <button>Create Id</button>
    </form>
  </div>
  )
}

export default login
