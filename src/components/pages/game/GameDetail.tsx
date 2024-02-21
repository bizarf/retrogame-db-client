import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import useUserStore from "../../../stores/useUserStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { checkAccessToken } from "../../../utilities/authUtils";

type GameInfo = {
    game_id: string;
    title: string;
    description: string;
    release_year: string;
    genre_name: string;
    platform_name: string;
    publisher_name: string;
    developer_name: string;
    image_url: string;
};

const GameDetail = () => {
    const [game, setGame] = useState<GameInfo>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const { user } = useUserStore();

    const cookies = new Cookies();
    const navigate = useNavigate();
    const { game_id } = useParams();

    const fetchGameData = () => {
        fetch(`http://127.0.0.1:8000/game/${game_id}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setGame(data.detail.game);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAddToFaves = () => {
        setLoading((state) => !state);
        let data;
        if (game_id) {
            data = {
                game_id: parseInt(game_id),
            };
        }

        try {
            checkAccessToken();
            const access_token = cookies.get("jwt_access_token");

            fetch("http://127.0.0.1:8000/favourites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Include the JWT token in the Authorization header
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.detail.success) {
                        navigate(0);
                    } else {
                        setError(data.detail.message);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchGameData();
        console.log(game);
    }, []);

    return (
        <>
            {game && (
                <>
                    <h1 className="py-4 text-center text-4xl font-bold italic text-gray-800 dark:text-white">
                        {game.title}
                    </h1>
                    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                        <div className="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
                            <div>
                                <img
                                    className="max-w-md"
                                    src={game.image_url}
                                    alt="Image Description"
                                />
                            </div>
                            <div className="mt-5 sm:mt-10 lg:mt-0">
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="space-y-2 md:space-y-4">
                                        <p className="text-gray-500">
                                            {game.description}
                                        </p>
                                    </div>
                                    <ul
                                        role="list"
                                        className="space-y-2 sm:space-y-4"
                                    >
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-500">
                                                <span className="font-bold">
                                                    Genre:
                                                </span>{" "}
                                                {game.genre_name}
                                            </span>
                                        </li>
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-500">
                                                <span className="font-bold">
                                                    Platform:
                                                </span>{" "}
                                                {game.platform_name}
                                            </span>
                                        </li>
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-500">
                                                <span className="font-bold">
                                                    Release Year:
                                                </span>{" "}
                                                {game.release_year}
                                            </span>
                                        </li>
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-500">
                                                <span className="font-bold">
                                                    Developer:
                                                </span>{" "}
                                                {game.developer_name}
                                            </span>
                                        </li>
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-500">
                                                <span className="font-bold">
                                                    Publisher:
                                                </span>{" "}
                                                {game.publisher_name}
                                            </span>
                                        </li>
                                        {user && (
                                            <li className="flex space-x-3">
                                                <button
                                                    className="text-sm sm:text-base text-blue-600 hover:text-blue-800"
                                                    onClick={handleAddToFaves}
                                                >
                                                    Add to favourites
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {loading && <LoadingSpinner />}
        </>
    );
};

export default GameDetail;
