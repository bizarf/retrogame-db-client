import { useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import useUserStore from "../../../stores/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import useDeleteModalStore from "../../../stores/useDeleteModalStore";
import DeleteModal from "../../modals/DeleteModal";
import imagePlaceholder from "../../../assets/images/image_placeholder.webp";

type Platform = {
    platform_id: string;
    name: string;
    logo_url: string;
};

const Platforms = () => {
    const [platforms, setPlatforms] = useState<[Platform]>();
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

    const fetchPlatforms = () => {
        fetch("http://127.0.0.1:8000/platforms")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setPlatforms(data.detail.rows);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteButtonClick = (id: string) => {
        setDeleteMode("platform");
        setId(id);
        setDeleteModal();
    };

    const handleEditButtonClick = (id: string) => {
        navigate(`/platforms/edit/${id}`);
    };

    useEffect(() => {
        fetchPlatforms();

        return () => {
            resetDeleteModal();
        };
    }, []);

    return (
        <div className="bg-gradient-to-b from-violet-600/[.15] via-transparent">
            <h1 className="py-4 text-center text-4xl font-bold italic text-gray-800 dark:text-white">
                Platforms
            </h1>
            {user?.role === "admin" && (
                <Link
                    className="inline-flex items-center font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ml-4"
                    to="/platforms/add"
                >
                    Add platform
                </Link>
            )}
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
                                    {platforms &&
                                        platforms.map((platform) => {
                                            return (
                                                <tr key={platform.platform_id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        {!platform.logo_url ? (
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
                                                                    platform.logo_url
                                                                }
                                                                alt=""
                                                                className="max-w-24 border solid border-black"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        <Link
                                                            to={`/platforms/${platform.platform_id}`}
                                                        >
                                                            {platform.name}
                                                        </Link>
                                                    </td>
                                                    {user?.role === "admin" && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditButtonClick(
                                                                        platform.platform_id
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
                                                                        platform.platform_id
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
        </div>
    );
};

export default Platforms;
