import { jwtDecode } from "jwt-decode";
import JwtDecodeType from "../types/JwtDecodeType";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// checks if the access token has expired. used before any operation that makes use of a jwt access token
export const checkAccessToken = async () => {
    const access_token = await cookies.get("jwt_access_token");
    const refresh_token = await cookies.get("jwt_refresh_token");

    if (!access_token && refresh_token) {
        try {
            await fetchNewAccessToken(refresh_token);
        } catch (e) {
            console.log(e);
        }
    }
};

export const fetchNewAccessToken = async (refresh_token: string) => {
    try {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_HOST
            }/token/refresh?refresh_token=${refresh_token}`,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data) {
            const access_decode: JwtDecodeType = jwtDecode(data.access_token);
            const refresh_decode: JwtDecodeType = jwtDecode(data.refresh_token);
            cookies.set("jwt_access_token", data.access_token, {
                // multiply the expiration value from the access token by 1000 to change the value to milliseconds so that it'll become a valid date
                expires: new Date(access_decode.exp * 1000),
            });
            cookies.set("jwt_refresh_token", data.refresh_token, {
                // multiply the expiration value from the refresh token by 1000 to change the value to milliseconds so that it'll become a valid date
                expires: new Date(refresh_decode.exp * 1000),
            });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
