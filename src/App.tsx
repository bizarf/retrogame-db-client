import Cookies from "universal-cookie";
import "./App.css";
import Router from "./Router";
import useUserStore from "./stores/useUserStore";

const App = () => {
    // user state setter
    const { setUser } = useUserStore();

    const cookies = new Cookies();

    const fetchUserData = () => {
        const jwt = cookies.get("jwt_auth");

        fetch(`http://127.0.0.1:8000/users/me/`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                // Include the JWT token in the Authorization header
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === true) {
                    setUser(data.user);
                }
            });
    };

    return (
        <div className="flex min-h-full flex-col bg-slate-900">
            <Router fetchUserData={fetchUserData} />
        </div>
    );
};

export default App;
