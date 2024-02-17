import Cookies from "universal-cookie";

const cookies = new Cookies();

export const fetchUserData = async () => {
    const access_token = cookies.get("jwt_access_token");

    try {
        const response = await fetch(`http://127.0.0.1:8000/users/me/`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                // Include the JWT token in the Authorization header
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
