import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import useUserStore from "../../../stores/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import useDeleteModalStore from "../../../stores/useDeleteModalStore";
import DeleteModal from "../../modals/DeleteModal";
import THName from "../../UI/tableHeaders/THName";
import THActions from "../../UI/tableHeaders/THActions";
import EditBtn from "../../UI/EditBtn";
import DeleteBtn from "../../UI/DeleteBtn";

type Genre = {
    genre_id: string;
    name: string;
};

const Genres = () => {
    const [genres, setGenres] = useState<[Genre]>();
    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useUserStore();
    const {
        deleteModal,
        setDeleteModal,
        setDeleteMode,
        setId,
        resetDeleteModal,
    } = useDeleteModalStore();

    const navigate = useNavigate();

    const fetchGenres = () => {
        fetch(`${import.meta.env.VITE_API_HOST}/genres`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setGenres(data.detail.rows);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteButtonClick = (id: string) => {
        setDeleteMode("genre");
        setId(id);
        setDeleteModal();
    };

    const handleEditButtonClick = (id: string) => {
        navigate(`/genres/edit/${id}`);
    };

    useEffect(() => {
        fetchGenres();

        return () => {
            resetDeleteModal();
        };
    }, []);

    return (
        <div className="bg-gradient-to-b from-violet-600/[.15] via-transparent">
            <h1 className="py-4 text-center text-4xl font-bold italic text-gray-800 dark:text-white">
                Genres
            </h1>
            {user?.role === "admin" && (
                <Link
                    className="inline-flex items-center font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ml-4"
                    to="/genres/add"
                >
                    Add genre
                </Link>
            )}
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <THName />
                                        {user?.role === "admin" && (
                                            <THActions />
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-400 dark:divide-gray-700">
                                    {genres &&
                                        genres.map((genre) => {
                                            return (
                                                <tr key={genre.genre_id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/genres/gamelist/${genre.genre_id}`}
                                                        >
                                                            {genre.name}
                                                        </Link>
                                                    </td>
                                                    {user?.role === "admin" && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                            <EditBtn
                                                                onClick={() =>
                                                                    handleEditButtonClick(
                                                                        genre.genre_id
                                                                    )
                                                                }
                                                            />
                                                            <DeleteBtn
                                                                onClick={() =>
                                                                    handleDeleteButtonClick(
                                                                        genre.genre_id
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

export default Genres;
