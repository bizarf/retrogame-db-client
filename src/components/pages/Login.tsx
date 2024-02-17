import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import JwtDecodeType from "../../types/JwtDecodeType";
import useUserStore from "../../stores/useUserStore";
import LoadingSpinner from "../LoadingSpinner";
import { fetchUserData } from "../../utilities/fetchUserData";

const Login = () => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    // user object state
    const { user, setUser } = useUserStore();

    // initialize universal-cookie
    const cookies = new Cookies();
    const navigate = useNavigate();

    const sendLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // turn the loading spinner on
        setLoading((state) => !state);
        // make an form object with the email and password input states
        const formData = new FormData();
        if (email && password) {
            formData.append("username", email);
            formData.append("password", password);
        }

        // start fetch api, with a post method and set the header content type to json
        fetch("http://127.0.0.1:8000/users/login", {
            method: "POST",
            // send to the body as it's form data which the endpoint it looking for
            body: formData,
        })
            .then((res) => res.json())
            .then(async (data) => {
                // turn off the loading spinner
                setLoading((state) => !state);
                // data object can either return a token or errors. if we get the token object, then we decode the token and set that as the user state. we store the jwt in the cookie.
                if (data.success) {
                    const access_decode: JwtDecodeType = jwtDecode(
                        data.access_token
                    );
                    const refresh_decode: JwtDecodeType = jwtDecode(
                        data.refresh_token
                    );
                    cookies.set("jwt_access_token", data.access_token, {
                        // multiply the expiration value from the access token by 1000 to change the value to milliseconds so that it'll become a valid date
                        expires: new Date(access_decode.exp * 1000),
                    });
                    cookies.set("jwt_refresh_token", data.refresh_token, {
                        // multiply the expiration value from the refresh token by 1000 to change the value to milliseconds so that it'll become a valid date
                        expires: new Date(refresh_decode.exp * 1000),
                    });
                    try {
                        const fetchUser = await fetchUserData();
                        setUser(fetchUser);
                    } catch (e) {
                        console.log(e);
                    }
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/");
                        navigate(0);
                    }, 500);
                } else {
                    console.log(data);
                    setError(data.detail);
                }
            });
    };

    // if user is already logged in, then send them back to the home page instead of letting them try to log in again
    useEffect(() => {
        if (user && !success) {
            navigate("/");
        }
    }, [user]);

    return (
        <div className="mx-auto max-w-xs">
            <h2 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                Login
            </h2>
            <form
                onSubmit={(e) => sendLogin(e)}
                className="rounded-xl border border-slate-500 p-4 dark:bg-gray-800"
            >
                <label
                    htmlFor="email"
                    className="block font-semibold dark:text-white"
                >
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                    required
                />
                <label
                    htmlFor="password"
                    className="mt-3 block font-semibold dark:text-white"
                >
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                    required
                />
                {error && (
                    <div className="text-sm text-red-600 text-center mt-2">
                        {error}
                    </div>
                )}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {loading && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
            {success && (
                <div className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/[.7]">
                    <div className="rounded-xl border border-slate-500 dark:bg-slate-800 p-4 bg-white">
                        <h2 className="text-2xl sm:text-3xl dark:text-white">
                            Login was successful!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
