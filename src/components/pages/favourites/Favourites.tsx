import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import useUserStore from "../../../stores/useUserStore";
import { Link } from "react-router-dom";
import useDeleteModalStore from "../../../stores/useDeleteModalStore";
import DeleteModal from "../../modals/DeleteModal";
import { checkAccessToken } from "../../../utilities/authUtils";
import Cookies from "universal-cookie";
import imagePlaceholder from "../../../assets/images/image_placeholder.webp";

type FavouritesType = {
    favourite_id: string;
    game_id: string;
    game_title: string;
    release_year: string;
    image_url: string;
    genre_id: string;
    genre_name: string;
    platform_id: string;
    platform_name: string;
    developer_id: string;
    developer_name: string;
    publisher_id: string;
    publisher_name: string;
};

const Favourites = () => {
    const [games, setGames] = useState<[FavouritesType]>();
    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useUserStore();
    const {
        deleteModal,
        setDeleteModal,
        setDeleteMode,
        setId,
        resetDeleteModal,
    } = useDeleteModalStore();

    const cookies = new Cookies();

    const fetchFavouriteGames = async () => {
        await checkAccessToken();
        const access_token = cookies.get("jwt_access_token");

        fetch(`http://127.0.0.1:8000/favourites/`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                // Include the JWT token in the Authorization header
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setGames(data.detail.games);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteButtonClick = (id: string) => {
        setDeleteMode("fave");
        setId(id);
        setDeleteModal();
    };

    useEffect(() => {
        fetchFavouriteGames();

        return () => {
            resetDeleteModal();
        };
    }, []);

    return (
        <div className="bg-gradient-to-b from-violet-600/[.15] via-transparent">
            <h1 className="py-4 text-center text-4xl font-bold italic text-gray-800 dark:text-white">
                Favourites
            </h1>
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-start text-sm font-medium text-gray-800 dark:text-gray-400 uppercase"
                                        >
                                            Image
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-start text-sm font-medium text-gray-800 dark:text-gray-400 uppercase columns-6"
                                        >
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-start text-sm font-medium text-gray-800 dark:text-gray-400 uppercase"
                                        >
                                            Genre
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-start text-sm font-medium text-gray-800 dark:text-gray-400 uppercase"
                                        >
                                            Platform
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-start text-sm font-medium text-gray-800 dark:text-gray-400 uppercase"
                                        >
                                            Developer
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-start text-sm font-medium text-gray-800 dark:text-gray-400 uppercase"
                                        >
                                            Publisher
                                        </th>
                                        {user?.role === "admin" && (
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-end text-sm font-medium text-gray-800 dark:text-gray-400 uppercase"
                                            >
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                                    {games &&
                                        games.map((game) => {
                                            return (
                                                <tr key={game.game_id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        {game.image_url ===
                                                        "" ? (
                                                            <img
                                                                src={
                                                                    imagePlaceholder
                                                                }
                                                                alt=""
                                                                className="max-w-24 border solid border-black"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={
                                                                    game.image_url
                                                                }
                                                                alt=""
                                                                className="max-w-24 border solid border-black"
                                                            />
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/game/${game.game_id}`}
                                                        >
                                                            {game.game_title}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/genres/${game.genre_id}`}
                                                        >
                                                            {game.genre_name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/platforms/${game.platform_id}`}
                                                        >
                                                            {game.platform_name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/developers/${game.developer_id}`}
                                                        >
                                                            {
                                                                game.developer_name
                                                            }
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/publishers/${game.publisher_id}`}
                                                        >
                                                            {
                                                                game.publisher_name
                                                            }
                                                        </Link>
                                                    </td>
                                                    {user && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteButtonClick(
                                                                        game.favourite_id
                                                                    )
                                                                }
                                                                type="button"
                                                                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {deleteModal && <DeleteModal />}
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default Favourites;
