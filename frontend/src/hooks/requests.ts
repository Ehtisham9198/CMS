import { IFile } from "../pages/Dashboard";
import { IAction } from "../pages/ViewFilePage";

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export async function logout(): Promise<string | null> {
    try {
        const response = await fetch(SERVER_URL + '/api/auth/logout', {
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
        const response = await fetch(SERVER_URL + '/api/auth/login', {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'
        });

        if (response.ok) {
            // console.log('Login successful:', await response.json());
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
        const response = await fetch(SERVER_URL + "/api/ReceivedFiles", {
            credentials: "include",
        });
        const data = await response.json();

        return data.fileData as IFile[]
    } catch (error) {
        console.error("Error fetching files:", error);
        return []
    }
};

export const TrackMyFiles = async (): Promise<IFile[]> => {
    try {
        const response = await fetch(SERVER_URL + "/api/trackMyFile", {
            credentials: "include",
        });
        const data = await response.json();

        return data.fileData as IFile[]
    } catch (error) {
        console.error("Error fetching files:", error);
        return []
    }
};

export const getFile = async (file_id: string): Promise<IFile | null> => {
    try {
        const response = await fetch(SERVER_URL + "/api/file/" + file_id, {
            credentials: "include",
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.data as IFile;
    } catch (error) {
        console.error("Error fetching files:", error);
        return null;
    }
};

export const getActions = async (file_id: string): Promise<IAction[]> => {
    try {
        const resposnse = await fetch(SERVER_URL + '/api/track/' + file_id);
        if (!resposnse.ok) {
            console.log("error getting actions", resposnse);
            return [];
        }
        const result = await resposnse.json();
        // console.log("actions", result);
        return result.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getAllDesignations = async (): Promise<{ designation: string }[]> => {
    try {
        const response = await fetch(SERVER_URL + '/api/user/designations');

        if (response.ok) {
            const result = await response.json();
            // console.log("designations", result.data);
            return result.data;
        }

        return [];
    } catch (err) {
        console.log(err);
        return [];
    }
}
