import { useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import useUserStore from "../../stores/useUserStore";
import { fetchUserData } from "../../utilities/fetchUserData";
import { fetchNewAccessToken } from "../../utilities/authUtils";
import useThemeStore from "../../stores/useThemeStore";
import LightModeBtn from "./LightModeBtn";
import DarkModeBtn from "./DarkModeBtn";

const Header = () => {
    // user object state and setter
    const { user, setUser } = useUserStore();

    // theme handling block
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const pageTheme = localStorage.getItem("theme") || "light";
        setTheme(pageTheme);
    }, []);

    useEffect(() => {
        const handleThemeChange = () => {
            const htmlElement = document.querySelector("html");

            if (theme === "light") {
                htmlElement?.classList.remove("dark");
                localStorage.setItem("theme", "light");
            } else if (theme === "dark") {
                htmlElement?.classList.add("dark");
                localStorage.setItem("theme", "dark");
            }
        };
        handleThemeChange();
    }, [theme]);

    const cookies = new Cookies();

    const logout = () => {
        // delete the JWT token from the cookie
        setUser(undefined);
        cookies.remove("jwt_access_token");
        cookies.remove("jwt_refresh_token");
    };

    useEffect(() => {
        const checkAuthCookie = async () => {
            try {
                const access_token = await cookies.get("jwt_access_token");
                const refresh_token = await cookies.get("jwt_refresh_token");

                if (!access_token && refresh_token) {
                    await fetchNewAccessToken(refresh_token);
                }

                const updated_access_token = await cookies.get(
                    "jwt_access_token"
                );
                if (updated_access_token) {
                    const fetchUser = await fetchUserData();
                    setUser(fetchUser);
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkAuthCookie();
    }, []);

    return (
        <div>
            <header className="sticky top-0 z-50 flex w-full bg-sky-200 py-4 text-sm dark:bg-gray-800">
                <nav className="flex w-full items-center justify-between gap-5 px-5 ">
                    <Link
                        className="whitespace-nowrap text-xl text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200 italic font-bold"
                        to="/"
                    >
                        RetroGame DB
                    </Link>
                    <div className="inline-flex">
                        <Link
                            className="whitespace-nowrap px-2 text-sm text-slate-700 font-bold hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                            to="/"
                        >
                            Home
                        </Link>
                        {!user && (
                            <>
                                <Link
                                    className="whitespace-nowrap px-2 text-sm text-slate-700 font-bold hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                                    to="/login"
                                >
                                    Login
                                </Link>
                                <Link
                                    className="whitespace-nowrap px-2 text-sm text-slate-700 font-bold hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                                    to="/register"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                        {user && (
                            <Link
                                className="whitespace-nowrap px-2 text-sm text-slate-700 font-bold hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                                to="/"
                                onClick={logout}
                            >
                                Logout
                            </Link>
                        )}
                        <div className="px-2 -mt-[0.10rem]">
                            {theme === "light" && <LightModeBtn />}
                            {theme === "dark" && <DarkModeBtn />}
                        </div>
                    </div>
                </nav>
            </header>
            <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-sky-200 text-sm py-2 dark:bg-gray-800">
                <nav
                    className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between"
                    aria-label="Global"
                >
                    <div className="flex flex-row items-center gap-5 pb-2 overflow-x-auto sm:justify-end sm:pb-0 sm:overflow-x-visible [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
                        {user?.role === "admin" && (
                            <Link
                                className="whitespace-nowrap font-bold text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                                to="/game/add"
                            >
                                Add game
                            </Link>
                        )}
                        <Link
                            className="whitespace-nowrap font-bold text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                            to="/platforms"
                        >
                            Platforms
                        </Link>
                        <Link
                            className="whitespace-nowrap font-bold text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                            to="/genres"
                        >
                            Genres
                        </Link>
                        <Link
                            className="whitespace-nowrap font-bold text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                            to="/developers"
                        >
                            Developers
                        </Link>
                        <Link
                            className="whitespace-nowrap font-bold text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                            to="/publishers"
                        >
                            Publishers
                        </Link>
                        {user && (
                            <>
                                <Link
                                    className="whitespace-nowrap font-bold text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200 sm:hidden"
                                    to="/favourites"
                                >
                                    Favourites
                                </Link>
                                <div className="whitespace-nowrap sm:hidden">
                                    <span className="text-slate-700 dark:text-white font-bold text-sm ">
                                        |
                                    </span>
                                    <span className="text-slate-700 dark:text-white font-bold text-sm ml-4 ">
                                        Logged in: {user.username}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="hidden sm:flex gap-5">
                        {user && (
                            <>
                                <Link
                                    className="whitespace-nowrap font-bold text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                                    to="/favourites"
                                >
                                    Favourites
                                </Link>
                                <div className="whitespace-nowrap">
                                    <span className="text-slate-700 dark:text-white font-bold text-sm ">
                                        |
                                    </span>
                                    <span className="text-slate-700 dark:text-white font-bold text-sm ml-4">
                                        Logged in: {user.username}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;
