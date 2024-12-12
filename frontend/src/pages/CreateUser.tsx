import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Tracks session-checking status

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/checksession', {
          method: "GET",
          credentials: 'include',
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
    if (!loading && isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, loading, navigate]);

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

    if (response.ok) {
      setIsLoggedIn(true); // Update state to reflect successful login
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/logout', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include'
      });
      setIsLoggedIn(false);
      console.log("Logged Out")
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
