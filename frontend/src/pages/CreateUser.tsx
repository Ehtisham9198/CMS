import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/checksession', {
          method:"GET",
          credentials:'include'
        });
        console.log(response, "poo");
  
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      }
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
    return <div>You must be logged in to access this page.</div>;
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
