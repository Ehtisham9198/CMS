import { SERVER_URL } from '@/hooks/requests';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
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

  const logout = async () => {
    try {
      await fetch(SERVER_URL + '/api/logout', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setIsLoading(false);
      console.log("Logged Out")
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // If the user is not logged in, show a message or redirect them
  if (isLoading) {
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
