import { createHashRouter, RouterProvider } from "react-router-dom";
import Register from "./components/pages/Register";
import HomePage from "./components/pages/HomePage";
import MainLayout from "./components/layouts/MainLayout";
import Login from "./components/pages/Login";
// platforms
import Platforms from "./components/pages/platform/Platforms";
import PlatformEditor from "./components/pages/platform/PlatformEditor";
import PlatformGameList from "./components/pages/platform/PlatformGameList";
// publishers
import Publishers from "./components/pages/publisher/Publishers";
import PublisherEditor from "./components/pages/publisher/PublisherEditor";
import PublisherGameList from "./components/pages/publisher/PublisherGameList";
// genres
import Genres from "./components/pages/genre/Genres";
import GenreEditor from "./components/pages/genre/GenreEditor";
import GenreGameList from "./components/pages/genre/GenreGameList";
// developers
import Developers from "./components/pages/developer/Developers";
import DeveloperEditor from "./components/pages/developer/DeveloperEditor";
import DeveloperGameList from "./components/pages/developer/DeveloperGameList";
import GameEditor from "./components/pages/game/GameEditor";
import GameDetail from "./components/pages/game/GameDetail";
import Favourites from "./components/pages/favourites/Favourites";
// games

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
                // platform block
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
                {
                    path: "/platforms/:platform_id/games/add",
                    element: <GameEditor />,
                },
                // publisher block
                {
                    path: "/publishers",
                    element: <Publishers />,
                },
                {
                    path: "/publishers/add",
                    element: <PublisherEditor />,
                },
                {
                    path: "/publishers/edit/:publisher_id",
                    element: <PublisherEditor />,
                },
                {
                    path: "/publishers/:publisher_id",
                    element: <PublisherGameList />,
                },
                // genre block
                {
                    path: "/genres",
                    element: <Genres />,
                },
                {
                    path: "/genres/add",
                    element: <GenreEditor />,
                },
                {
                    path: "/genres/edit/:genre_id",
                    element: <GenreEditor />,
                },
                {
                    path: "/genres/:genre_id",
                    element: <GenreGameList />,
                },
                // developer block
                {
                    path: "/developers",
                    element: <Developers />,
                },
                {
                    path: "/developers/add",
                    element: <DeveloperEditor />,
                },
                {
                    path: "/developers/edit/:developer_id",
                    element: <DeveloperEditor />,
                },
                {
                    path: "/developers/:developer_id",
                    element: <DeveloperGameList />,
                },
                // game block
                {
                    path: "/game/add",
                    element: <GameEditor />,
                },
                {
                    path: "/game/edit/:game_id",
                    element: <GameEditor />,
                },
                {
                    path: "/game/:game_id",
                    element: <GameDetail />,
                },
                // faves block
                {
                    path: "/favourites",
                    element: <Favourites />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Router;
