import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";
import LoadingSpinner from "../LoadingSpinner";

const Register = () => {
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [error, setError] = useState<string>();
    // if the success state is true, then the form will disappear and a success message will be displayed to the user
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const navigate = useNavigate();

    // user object state
    const { user } = useUserStore();

    const sendSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password != confirmPassword) {
            return setPasswordError(true);
        } else if (password === confirmPassword) {
            setPasswordError(false);
        }
        // turn on the loading spinner
        setLoading((state) => !state);

        // make an object with the sign up detail states
        const data = {
            username,
            email,
            password,
        };

        // start fetch api, with a post method and set the header content type to json
        fetch("http://127.0.0.1:8000/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                // turn off the loading spinner
                setLoading((state) => !state);
                // data object can either return a token or errors. if we get the token object, then we decode the token and set that as the user state. we store the jwt in the cookie.
                if (data.detail.success === true) {
                    // some sort of way to show sign up successful message
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                } else {
                    // error messages go here
                    setError(data.detail.message);
                }
            });
    };

    // if user is already logged in, then send them back to the home page instead of letting them try to sign up again
    useEffect(() => {
        if (user && !success) {
            navigate("/");
        }
    });

    return (
        <div className="mx-auto flex w-full max-w-sm flex-col">
            <h2 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                Sign Up
            </h2>
            <form
                onSubmit={(e) => sendSignUp(e)}
                className="mb-4 rounded-xl border border-slate-500 p-4 dark:bg-gray-800"
            >
                <label
                    htmlFor="username"
                    className="mb-2 mt-5 block font-semibold dark:text-white"
                >
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                    required
                />
                <label
                    htmlFor="email"
                    className="mb-2 mt-5 block font-semibold dark:text-white"
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
                    className="mb-2 mt-5 block font-semibold dark:text-white"
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
                    minLength={8}
                />
                <label
                    htmlFor="confirmPassword"
                    className="mb-2 mt-5 block font-semibold dark:text-white"
                >
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400"
                    required
                    minLength={8}
                />
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        Submit
                    </button>
                </div>
                {passwordError && (
                    <div className="text-sm text-red-600 text-center mt-4">
                        The passwords don't match
                    </div>
                )}
                {error && (
                    <div className="text-sm text-red-600 text-center mt-4">
                        {error}
                    </div>
                )}
            </form>
            {loading && <LoadingSpinner />}
            {success && (
                <div className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/[.7]">
                    <div className="rounded-xl border border-slate-500 dark:bg-slate-800 p-4 bg-white">
                        <h2 className="text-2xl sm:text-3xl dark:text-white">
                            Sign up was successful!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
