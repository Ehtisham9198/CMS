import { IFile } from "../pages/Dashboard";

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

export async function getFiles(): Promise<IFile[]> {
    return [
        { id: "cse/45", title: "Admission", created_by: "Rakesh", forwarded_by: "birju_op", created_at: "24 dec 2025" },
        { id: "cse/22", title: "AK dash", created_by: "Ajaya", forwarded_by: "birju_op", created_at: "24 dec 2025" },
        { id: "ce/20", title: "STudents", created_by: "Pradyut", forwarded_by: "birju_op", created_at: "24 dec 2025" },
        { id: "it/69", title: "STudents", created_by: "Pradyut", forwarded_by: "birju_op", created_at: "24 dec 2025" },
    ]
}

// const getFiles = async () => {
//     try {
//         const response = await fetch("http://localhost:3000/api/recievedFile", {
//             credentials: "include",
//         });
//         const data = await response.json();
//         console.log(data);
//         setFiles(data.fileData);
//     } catch (error) {
//         console.error("Error fetching files:", error);
//     }
// };