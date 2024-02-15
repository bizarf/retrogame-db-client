import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
// import JwtDecodeType from "../types/jwt_decode";
// import ErrorsType from "../types/errors";
import useUserStore from "../../stores/useUserStore";

type Props = {
    fetchUserData: () => void;
};

const Login = ({ fetchUserData }: Props) => {
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    // const [error, setError] = useState<[ErrorsType] | []>([]);
    // if the success state is true, then the form will disappear and a success message will be displayed to the user
    const [success, setSuccess] = useState<boolean>(false);

    // user object state
    const { user } = useUserStore();

    // initialize universal-cookie
    const cookies = new Cookies();
    const navigate = useNavigate();

    const sendLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // make an object with the username and password input states
        const data = { username, password };

        // start fetch api, with a post method and set the header content type to json
        fetch("https://odin-blog-api-ofv2.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                // data object can either return a token or errors. if we get the token object, then we decode the token and set that as the user state. we store the jwt in the cookie.
                if (data.success) {
                    // const decode: JwtDecodeType = jwtDecode(data.token);
                    cookies.set("jwt_auth", data.token, {
                        // multiply the expiration value from the jwt by 1000 to change the value to milliseconds so that it'll become a valid date
                        expires: new Date(decode.exp * 1000),
                    });
                    fetchUserData();
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/");
                        navigate(0);
                    }, 500);
                } else if (Array.isArray(data.errors)) {
                    // error messages from express validator go here
                    // setError(data.errors);
                } else {
                    // if the error message is an object from passport, then we need to put it in an array
                    // setError([data]);
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
            {!success ? (
                <>
                    <h2 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                        Login
                    </h2>
                    <form
                        onSubmit={(e) => sendLogin(e)}
                        className="rounded-xl border border-slate-500 p-4 dark:bg-gray-800"
                    >
                        <label
                            htmlFor="username"
                            className="block font-semibold dark:text-white"
                        >
                            Username
                        </label>
                        <input
                            type="email"
                            name="username"
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                        />
                        {/* {error.map((error, index) => {
                            if (error.path === "username") {
                                return (
                                    <div
                                        key={index}
                                        className="text-sm text-red-600"
                                    >
                                        {error.msg}
                                    </div>
                                );
                            }
                        })} */}
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
                        />
                        {/* {error.map((error, index) => {
                            // error messages from express validator
                            if (error.path === "password") {
                                return (
                                    <div
                                        key={index}
                                        className="text-sm text-red-600"
                                    >
                                        {error.msg}
                                    </div>
                                );
                                // error message from passport js
                            } else if (error.msg === "Incorrect password") {
                                return (
                                    <div
                                        key={index}
                                        className="text-sm text-red-600"
                                    >
                                        {error.msg}
                                    </div>
                                );
                            }
                        })} */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <h2 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                    Login was successful!
                </h2>
            )}
        </div>
    );
};

export default Login;
