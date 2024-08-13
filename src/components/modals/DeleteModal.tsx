import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import useDeleteModalStore from "../../stores/useDeleteModalStore";
import { checkAccessToken } from "../../utilities/authUtils";
import DeleteBtnYes from "../UI/DeleteBtnYes";

const DeleteModal = () => {
    // init universal cookie
    const cookies = new Cookies();

    const navigate = useNavigate();

    // import zustand state and state setters
    const { setDeleteModal, deleteMode, id } = useDeleteModalStore();

    const handleCloseModal = () => {
        setDeleteModal();
    };

    const handleDeleteRequest = async (id: string, category: string) => {
        try {
            checkAccessToken();
            // need to send the jwt as the route is protected
            const access_token = cookies.get("jwt_access_token");

            fetch(`${import.meta.env.VITE_API_HOST}/${category}/${id}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.detail.success) {
                        setDeleteModal();
                        navigate(0);
                    } else {
                        console.log(data.detail.message);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            //set the background colour opacity instead of the separate opacity setting as this will prevent elements inside of the modal from having the separate opacity setting applied
            className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center z-50 bg-black/[.2]"
            onClick={handleCloseModal}
        >
            <div
                className="p-6 rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]"
                // stopPropagation prevents any events within this div from activating the above setDeleteModal function
                onClick={(e) => e.stopPropagation()}
            >
                {deleteMode == "fave" ? (
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                        Do you want to remove this favourite?
                    </h2>
                ) : (
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                        Do you want to delete this {deleteMode}?
                    </h2>
                )}
                <div className="flex justify-center">
                    {deleteMode === "platform" && (
                        <DeleteBtnYes
                            onClick={() => handleDeleteRequest(id, "platform")}
                        />
                    )}
                    {deleteMode === "publisher" && (
                        <DeleteBtnYes
                            onClick={() => handleDeleteRequest(id, "publisher")}
                        />
                    )}
                    {deleteMode === "genre" && (
                        <DeleteBtnYes
                            onClick={() => handleDeleteRequest(id, "genre")}
                        />
                    )}
                    {deleteMode === "developer" && (
                        <DeleteBtnYes
                            onClick={() => handleDeleteRequest(id, "developer")}
                        />
                    )}
                    {deleteMode === "game" && (
                        <DeleteBtnYes
                            onClick={() => handleDeleteRequest(id, "game")}
                        />
                    )}
                    {deleteMode === "fave" && (
                        <DeleteBtnYes
                            onClick={() =>
                                handleDeleteRequest(id, "favourites")
                            }
                        />
                    )}
                    <button
                        onClick={handleCloseModal}
                        className="rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
