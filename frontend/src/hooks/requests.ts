import { IFile } from "../pages/Dashboard";
import { IAction } from "../pages/ViewFilePage";

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

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


export const getFiles = async (): Promise<IFile[]> => {
    try {
        const response = await fetch("http://localhost:3000/api/recievedFile", {
            credentials: "include",
        });
        const data = await response.json();
        console.log(data)
        return data.fileData as IFile[]
    } catch (error) {
        console.error("Error fetching files:", error);
        return [ ]
    }
};


export const getActions=async(file_id: string): Promise<IAction[]>=>{
    const resposnse = await fetch('http://localhost:3000/api/track/'+file_id);
    const result =  await resposnse.json();
    return result;
}