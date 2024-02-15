import { useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import useUserStore from "../../stores/useUserStore";

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
        cookies.remove("jwt_auth");
    };

    useEffect(() => {
        const checkCookie = async () => {
            const jwt = await cookies.get("jwt_auth");
            if (jwt) {
                fetchUserData();
            }
        };
        checkCookie();
    }, []);

    return (
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
    );
};

export default Header;
