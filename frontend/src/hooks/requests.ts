const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export async function logout(): Promise<string | null> {
    try {
        const response = await fetch(SERVER_URL + '/api/logout', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        return response.ok ? null : "something went wrong";
    } catch (error) {
        console.error(error);
        return "something went wrong";
    }
}

export async function login(username: string, password: string): Promise<string | null> {
    try {
        const response = await fetch(SERVER_URL + '/api/login', {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'

        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            return null;
        } else {
            const errorData = await response.json();
            console.error('Login error:', errorData);
            return errorData.error || "something went wrong";
        }
    } catch (error) {
        console.error('Error:', error);
        return "something went wrong";
    }
}