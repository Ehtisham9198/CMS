import { SERVER_URL } from "./requests";

export async function getMyDesignations(fallback?: string) {
    try {
        const response = await fetch(SERVER_URL + "/api/user/my-designations", {credentials: "include"});

        if(response.ok) {
            const result = await response.json();
            console.log(result);

            if(result.success) {
                return result.data.map((obj: any) => obj.designation);
            }
        }
    } catch (error) {
        console.log(error);
    }

    return [fallback];
}