import Cookies from "universal-cookie";
import "./App.css";
import Router from "./Router";
import useUserStore from "./stores/useUserStore";

const App = () => {
    // user state setter
    const { setUser } = useUserStore();

    const cookies = new Cookies();

    const fetchUserData = () => {
        const access_token = cookies.get("jwt_access_token");

        fetch(`http://127.0.0.1:8000/users/me/`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                // Include the JWT token in the Authorization header
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setUser(data);
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
