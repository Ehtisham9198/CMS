import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      let isLoggedIn: boolean = true;

      try {
        const response = await fetch(
          'http://localhost:3000/api/checksession',
          { credentials:'include' }
        );
  
        if (response.ok) {
          const data = await response.json();
          isLoggedIn = !!data.loggedIn;
        } else {
          isLoggedIn = false;
        }

      } catch (error) {
        console.error('Error checking session:', error);
        isLoggedIn = false;
      }

      if(!isLoggedIn) navigate("/login?redirect=/dashboard");
      setIsLoggedIn(isLoggedIn);
    };
  
    checkSession();
  }, []);
  

  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');

    const response = await fetch('http://localhost:3000/api/CreateUser', {
      method: "POST",
      body: JSON.stringify({ name, email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);
  };

  // logout
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // If the user is not logged in, show a message or redirect them
  if (!isLoggedIn) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <form onSubmit={SubmitHandler}>
        <label htmlFor="name">Enter Name</label> <br />
        <input name="name" type="text" id="name" required /> <br />
        <label htmlFor="email">Enter Email</label> <br />
        <input name="email" type="email" id="email" required /> <br />
        <button>Create Id</button>
        <br />
        <br />
        <button type="button" onClick={logout}>Logout</button>
      </form>
    </div>
  );
};

export default CreateUser;
