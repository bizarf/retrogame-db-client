import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import useUserStore from "../../../stores/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import useDeleteModalStore from "../../../stores/useDeleteModalStore";
import DeleteModal from "../../modals/DeleteModal";

type Publisher = {
    publisher_id: string;
    name: string;
};

// just made this file last night. start swapping platform names for publisher
const Publishers = () => {
    const [publishers, setPublishers] = useState<[Publisher]>();
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

    const fetchPublishers = () => {
        fetch("http://127.0.0.1:8000/publishers")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setPublishers(data.detail.rows);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteButtonClick = (id: string) => {
        setDeleteMode("publisher");
        setId(id);
        setDeleteModal();
    };

    const handleEditButtonClick = (id: string) => {
        navigate(`/publishers/edit/${id}`);
    };

    useEffect(() => {
        fetchPublishers();

        return () => {
            resetDeleteModal();
        };
    }, []);

    return (
        <>
            <h1 className="py-4 text-center text-4xl font-bold italic text-gray-800 dark:text-white">
                Publishers
            </h1>
            {user?.role === "admin" && (
                <Link
                    className="inline-flex items-center font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ml-4"
                    to="/publishers/add"
                >
                    Add publisher
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
                                    {publishers &&
                                        publishers.map((publisher) => {
                                            return (
                                                <tr
                                                    key={publisher.publisher_id}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/publishers/${publisher.publisher_id}`}
                                                        >
                                                            {publisher.name}
                                                        </Link>
                                                    </td>
                                                    {user?.role === "admin" && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditButtonClick(
                                                                        publisher.publisher_id
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
                                                                        publisher.publisher_id
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

export default Publishers;
