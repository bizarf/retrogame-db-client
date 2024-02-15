import { useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import useUserStore from "../../stores/useUserStore";
import { jwtDecode } from "jwt-decode";
import JwtDecodeType from "../../types/JwtDecodeType";

type Props = {
    fetchUserData: () => void;
};

const Header = ({ fetchUserData }: Props) => {
    // user object state and setter
    const { user, setUser } = useUserStore();

    const cookies = new Cookies();

    const logout = () => {
        // delete the JWT token from the cookie
        setUser(undefined);
        cookies.remove("jwt_access_token");
        cookies.remove("jwt_refresh_token");
    };

    useEffect(() => {
        const checkCookie = async () => {
            const access_token = await cookies.get("jwt_access_token");
            // refresh token logic. incomplete for now
            const refresh_token = await cookies.get("jwt_refresh_token");
            if (refresh_token) {
                const refresh_decode: JwtDecodeType = jwtDecode(refresh_token);
                const refresh_exp = refresh_decode.exp * 1000;
                if (refresh_exp < Date.now()) {
                    cookies.remove("jwt_access_token");
                    cookies.remove("jwt_refresh_token");
                }
            }
            if (access_token) {
                fetchUserData();
            }
        };
        checkCookie();
    }, []);

    return (
        <div>
            <header className="sticky top-0 z-50 flex w-full border-b-2 bg-white py-4 text-sm dark:border-b-0 dark:bg-gray-800">
                <nav className="flex w-full flex-row items-center justify-between gap-5 px-5 ">
                    <Link
                        className="whitespace-nowrap text-xl text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200 italic font-bold"
                        to="/"
                    >
                        RetroGame DB
                    </Link>
                    <div className="inline-flex">
                        <Link
                            className="whitespace-nowrap px-2 text-sm text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                            to="/"
                        >
                            Home
                        </Link>
                        {!user && (
                            <>
                                <Link
                                    className="whitespace-nowrap px-2 text-sm text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                                    to="/login"
                                >
                                    Login
                                </Link>
                                <Link
                                    className="whitespace-nowrap px-2 text-sm text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                                    to="/register"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                        {user && (
                            <Link
                                className="whitespace-nowrap px-2 text-sm text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                                to="/"
                                onClick={logout}
                            >
                                Logout
                            </Link>
                        )}
                    </div>
                </nav>
            </header>
            <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-2 dark:bg-gray-800">
                <nav
                    className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between"
                    aria-label="Global"
                >
                    <div className="flex flex-row items-center gap-5 pb-2 overflow-x-auto sm:justify-end sm:pb-0 sm:overflow-x-visible [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
                        <Link
                            className="whitespace-nowrap font-medium text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                            to="/platforms"
                        >
                            Platforms
                        </Link>
                        <Link
                            className="whitespace-nowrap font-medium text-slate-700 hover:text-slate-950 dark:text-white dark:hover:text-slate-200"
                            to="#"
                        >
                            Link
                        </Link>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;
