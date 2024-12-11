import React from 'react'

const CreateUser = () => {
    const SubmitHandler= async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const email = formData.get('email');

        const response = await fetch('http://localhost:3000/api/CreateUser',{
            method:"POST",
            body: JSON.stringify({ name:name,email:email}),
            headers: {
                "Content-Type": "application/json",
              },
        });
        console.log(response)

    }
  return (
    <div>
      <form onSubmit={SubmitHandler}>
        <label htmlFor="name">Enter Name</label> <br />
        <input name='name' type="text" id='name' required /> <br />
        <label htmlFor="email">Enter Email</label> <br />
        <input name='email' type="email" id='email' required /> <br />
        <button>Create Id</button>
      </form>
    </div>
  )
}

export default CreateUser
