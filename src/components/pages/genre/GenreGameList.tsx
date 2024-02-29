import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import useUserStore from "../../../stores/useUserStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import useDeleteModalStore from "../../../stores/useDeleteModalStore";
import DeleteModal from "../../modals/DeleteModal";
import imagePlaceholder from "../../../assets/images/image_placeholder.webp";
import THImage from "../../UI/tableHeaders/THImage";
import THName from "../../UI/tableHeaders/THName";
import THPlatform from "../../UI/tableHeaders/THPlatform";
import THDeveloper from "../../UI/tableHeaders/THDeveloper";
import THPublisher from "../../UI/tableHeaders/THPublisher";
import THActions from "../../UI/tableHeaders/THActions";
import EditBtn from "../../UI/EditBtn";
import DeleteBtn from "../../UI/DeleteBtn";

type Game = {
    game_id: string;
    game_title: string;
    image_url: string;
    platform_name: string;
    platform_id: string;
    developer_id: string;
    developer_name: string;
    publisher_id: string;
    publisher_name: string;
};

const GenreGameList = () => {
    const [games, setGames] = useState<[Game]>();
    const [genreName, setGenreName] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useUserStore();
    const {
        deleteModal,
        setDeleteModal,
        setDeleteMode,
        setId,
        resetDeleteModal,
    } = useDeleteModalStore();

    const { genre_id } = useParams();
    const navigate = useNavigate();

    const fetchGenreGames = () => {
        fetch(`${import.meta.env.VITE_API_HOST}/genre/${genre_id}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setGames(data.detail.games);
                    setGenreName(data.detail.genre_name);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteButtonClick = (id: string) => {
        setDeleteMode("game");
        setId(id);
        setDeleteModal();
    };

    const handleEditButtonClick = (id: string) => {
        navigate(`/game/edit/${id}`);
    };

    useEffect(() => {
        fetchGenreGames();

        return () => {
            resetDeleteModal();
        };
    }, []);

    return (
        <div className="bg-gradient-to-b from-violet-600/[.15] via-transparent">
            <h1 className="py-4 text-center text-4xl font-bold italic text-gray-800 dark:text-white">
                {genreName}
            </h1>
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <THImage />
                                        <THName />
                                        <THPlatform />
                                        <THDeveloper />
                                        <THPublisher />
                                        {user?.role === "admin" && (
                                            <THActions />
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-400 dark:divide-gray-700">
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
                                                            to={`/platforms/gamelist/${game.platform_id}`}
                                                        >
                                                            {game.platform_name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/developers/gamelist/${game.developer_id}`}
                                                        >
                                                            {
                                                                game.developer_name
                                                            }
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/publishers/gamelist/${game.publisher_id}`}
                                                        >
                                                            {
                                                                game.publisher_name
                                                            }
                                                        </Link>
                                                    </td>
                                                    {user?.role === "admin" && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                            <EditBtn
                                                                onClick={() =>
                                                                    handleEditButtonClick(
                                                                        game.game_id
                                                                    )
                                                                }
                                                            />
                                                            <DeleteBtn
                                                                onClick={() =>
                                                                    handleDeleteButtonClick(
                                                                        game.game_id
                                                                    )
                                                                }
                                                            />
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

export default GenreGameList;
