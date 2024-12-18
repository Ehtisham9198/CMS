import React, { useState } from 'react';

function CreateFile() {
    const [responseMessage, setResponseMessage] = useState('');

    const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
        const data = {
            ...formData,
            file_path: formData.path
        };

        

    return (
        <div>
            <form onSubmit={SubmitHandler}>
                <label htmlFor="id">Enter File id</label> <br />
                <input type="text" name="id" required /><br />

                <label htmlFor="Title">Enter the Title of file</label><br />
                <input type="text" name="title" required /> <br />
                <br />
                <br />

                <button type="submit">Create File</button>
            </form>

            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}
}
export default CreateFile;
