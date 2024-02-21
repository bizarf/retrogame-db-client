import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import useUserStore from "../../../stores/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import useDeleteModalStore from "../../../stores/useDeleteModalStore";
import DeleteModal from "../../modals/DeleteModal";

type Developer = {
    developer_id: string;
    name: string;
};

const Developers = () => {
    const [developers, setDevelopers] = useState<[Developer]>();
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

    const fetchDevelopers = () => {
        fetch("http://127.0.0.1:8000/developers")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setDevelopers(data.detail.rows);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteButtonClick = (id: string) => {
        setDeleteMode("developer");
        setId(id);
        setDeleteModal();
    };

    const handleEditButtonClick = (id: string) => {
        navigate(`/developers/edit/${id}`);
    };

    useEffect(() => {
        fetchDevelopers();

        return () => {
            resetDeleteModal();
        };
    }, []);

    return (
        <>
            <h1 className="py-4 text-center text-4xl font-bold italic text-gray-800 dark:text-white">
                Developers
            </h1>
            {user?.role === "admin" && (
                <Link
                    className="inline-flex items-center font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ml-4"
                    to="/developers/add"
                >
                    Add developer
                </Link>
            )}
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase columns-8"
                                        >
                                            Name
                                        </th>
                                        {user?.role === "admin" && (
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-end text-sm font-medium text-gray-500 uppercase"
                                            >
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {developers &&
                                        developers.map((developer) => {
                                            return (
                                                <tr
                                                    key={developer.developer_id}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/developers/${developer.developer_id}`}
                                                        >
                                                            {developer.name}
                                                        </Link>
                                                    </td>
                                                    {user?.role === "admin" && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditButtonClick(
                                                                        developer.developer_id
                                                                    )
                                                                }
                                                                type="button"
                                                                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 mr-4"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteButtonClick(
                                                                        developer.developer_id
                                                                    )
                                                                }
                                                                type="button"
                                                                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                                            >
                                                                Delete
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
        </>
    );
};

export default Developers;
