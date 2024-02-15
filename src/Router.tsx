import { createHashRouter, RouterProvider } from "react-router-dom";
import Register from "./components/pages/Register";
import HomePage from "./components/pages/HomePage";
import MainLayout from "./components/layouts/MainLayout";
import Login from "./components/pages/Login";

type Props = {
    fetchUserData: () => void;
};

const Router = ({ fetchUserData }: Props) => {
    // using hashrouter as Github pages does not support BrowserRouter
    const router = createHashRouter([
        {
            path: "/",
            element: <MainLayout fetchUserData={fetchUserData} />,
            children: [
                // the mainlayout uses an outlet and setting this will make the homepage the default page for that outlet element
                { index: true, element: <HomePage /> },
                {
                    path: "/login",
                    element: <Login fetchUserData={fetchUserData} />,
                },
                {
                    path: "/register",
                    element: <Register />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Router;
