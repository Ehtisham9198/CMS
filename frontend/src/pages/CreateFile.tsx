import React from 'react'

function CreateFile() {
    const SubmitHandler= async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget).entries());

        const response = await fetch('http://localhost:3000/api/initiate_file',{
            method:"POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
              },
        });
        console.log(response)

    }
  return (
    <div>
      <form onSubmit={SubmitHandler}>
        <label htmlFor="id">Enter id</label> <br />
        <input name='uploaded_by' type="text" id='id' required /> <br />
        <label htmlFor="file">Enter file</label> <br />
        <textarea name='title'  id='email' required /> <br />
        <label htmlFor="path">Enter path</label> <br />
        <input name='file_path' type="text" id='path' required /> <br />
        
        <button>Create File</button>
      </form>
    </div>
  )
}

export default CreateFile

