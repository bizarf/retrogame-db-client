import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import useUserStore from "../../../stores/useUserStore";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { checkAccessToken } from "../../../utilities/authUtils";
import DeleteModal from "../../modals/DeleteModal";
import useDeleteModalStore from "../../../stores/useDeleteModalStore";
import imagePlaceholder from "../../../assets/images/image_placeholder.webp";

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
    favourite_id: string;
};

const GameDetail = () => {
    const [game, setGame] = useState<GameInfo>();
    const [existingFave, setExistingFave] = useState<string>("");
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

    const handleAddToFaves = async () => {
        setLoading((state) => !state);
        const data = {
            game_id: game_id,
        };

        try {
            await checkAccessToken();
            const access_token = cookies.get("jwt_access_token");

            fetch("http://127.0.0.1:8000/favourites/", {
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
                        console.log(data.detail.message);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveFaveBtnClick = () => {
        setDeleteMode("fave");
        setId(existingFave);
        setDeleteModal();
    };

    const checkExistingFave = async () => {
        try {
            await checkAccessToken();
            const access_token = cookies.get("jwt_access_token");

            fetch(`http://127.0.0.1:8000/favourites/${game_id}`, {
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
                        if (data.detail.fave.length > 0) {
                            setExistingFave(data.detail.fave[0].favourite_id);
                        }
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error checking existing favourite data:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchGameData();
        if (user) {
            checkExistingFave();
        }
    }, [user]);

    useEffect(() => {
        return () => {
            resetDeleteModal();
        };
    }, []);

    return (
        <div className="bg-gradient-to-b from-violet-600/[.15] via-transparent">
            {game && (
                <>
                    <h1 className="py-4 text-center text-4xl font-bold italic text-gray-800 dark:text-white">
                        {game.title}
                    </h1>
                    <div className="max-w-[85rem] px-4 py-10 sm:px-6 md:px-4 lg:px-24 lg:py-14 mx-auto">
                        <div className="flex flex-col items-center md:grid md:grid-cols-2 md:items-center md:gap-52 lg:gap-32">
                            <div>
                                {game.image_url === "" ? (
                                    <img
                                        className="max-w-xs sm:max-w-md border solid border-black"
                                        src={imagePlaceholder}
                                        alt="Image Description"
                                    />
                                ) : (
                                    <img
                                        className="max-w-xs sm:max-w-md border solid border-black"
                                        src={game.image_url}
                                        alt="Image Description"
                                    />
                                )}
                            </div>
                            <div className="mt-5 sm:mt-10 lg:mt-0">
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="space-y-2 md:space-y-4">
                                        <p className="text-gray-800 dark:text-gray-200">
                                            {game.description}
                                        </p>
                                    </div>
                                    <ul
                                        role="list"
                                        className="space-y-2 sm:space-y-4"
                                    >
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                                                <span className="font-bold">
                                                    Genre:
                                                </span>{" "}
                                                {game.genre_name}
                                            </span>
                                        </li>
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                                                <span className="font-bold">
                                                    Platform:
                                                </span>{" "}
                                                {game.platform_name}
                                            </span>
                                        </li>
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                                                <span className="font-bold">
                                                    Release Year:
                                                </span>{" "}
                                                {game.release_year}
                                            </span>
                                        </li>
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                                                <span className="font-bold">
                                                    Developer:
                                                </span>{" "}
                                                {game.developer_name}
                                            </span>
                                        </li>
                                        <li className="flex space-x-3">
                                            <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                                                <span className="font-bold">
                                                    Publisher:
                                                </span>{" "}
                                                {game.publisher_name}
                                            </span>
                                        </li>
                                        {user && existingFave === "" && (
                                            <li className="flex space-x-3">
                                                <button
                                                    className="text-sm sm:text-base text-blue-600 hover:text-blue-800 font-bold"
                                                    onClick={handleAddToFaves}
                                                >
                                                    Add to favourites
                                                </button>
                                            </li>
                                        )}
                                        {user && existingFave != "" && (
                                            <li className="flex space-x-3">
                                                <button
                                                    className="text-sm sm:text-base text-blue-600 hover:text-blue-800"
                                                    onClick={
                                                        handleRemoveFaveBtnClick
                                                    }
                                                >
                                                    Remove from favourites
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {deleteModal && <DeleteModal />}
                    </div>
                </>
            )}
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default GameDetail;
