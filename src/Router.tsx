import { createHashRouter, RouterProvider } from "react-router-dom";
import Register from "./components/pages/Register";
import HomePage from "./components/pages/HomePage";
import MainLayout from "./components/layouts/MainLayout";
import Login from "./components/pages/Login";
import Platforms from "./components/pages/Platforms";
import PlatformEditor from "./components/pages/PlatformEditor";
import PlatformGameList from "./components/pages/PlatformGameList";

const Router = () => {
    // using hashRouter as Github pages does not support BrowserRouter
    const router = createHashRouter([
        {
            path: "/",
            element: <MainLayout />,
            children: [
                // the mainLayout uses an outlet and setting this will make the homepage the default page for that outlet element
                { index: true, element: <HomePage /> },
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/register",
                    element: <Register />,
                },
                {
                    path: "/platforms",
                    element: <Platforms />,
                },
                {
                    path: "/platforms/add",
                    element: <PlatformEditor />,
                },
                {
                    path: "/platforms/edit/:platform_id",
                    element: <PlatformEditor />,
                },
                {
                    path: "/platforms/:platform_id",
                    element: <PlatformGameList />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Router;
