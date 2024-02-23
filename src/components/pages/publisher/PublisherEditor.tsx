import { MouseEvent, useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../../stores/useUserStore";
import useEditorStore from "../../../stores/UseEditModeStore";
import { checkAccessToken } from "../../../utilities/authUtils";

const PublisherEditor = () => {
    const [publisherName, setPublisherName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // init universal-cookie
    const cookies = new Cookies();
    // init useNavigate
    const navigate = useNavigate();
    // useParams init
    const { publisher_id } = useParams();
    const { user } = useUserStore();
    const { editMode, setEditMode, resetEditMode } = useEditorStore();

    const handleAddPublisher = async (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();

        setLoading((state) => !state);
        const data = {
            name: publisherName,
        };

        try {
            await checkAccessToken();
            const access_token = cookies.get("jwt_access_token");

            fetch("https://retrogame-db-python-api.onrender.com/publisher", {
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
                        navigate("/publishers");
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

    const handleEditPublisher = async (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();

        setLoading((state) => !state);
        const data = {
            name: publisherName,
        };

        await checkAccessToken();
        const access_token = cookies.get("jwt_access_token");

        fetch(
            `https://retrogame-db-python-api.onrender.com/publisher/${publisher_id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // Include the JWT token in the Authorization header
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(data),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.detail.success) {
                    navigate("/publishers");
                } else {
                    setError(data.detail.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchPublisherData = (publisher_id: string) => {
        fetch(
            `https://retrogame-db-python-api.onrender.com/publisher-data/${publisher_id}`
        )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setPublisherName(data.detail.publisher.name);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (publisher_id) {
            setEditMode();
            fetchPublisherData(publisher_id);
        }

        if (user?.role != "admin") {
            navigate("/publishers");
        }

        return () => {
            resetEditMode();
        };
    }, [publisher_id]);

    return (
        <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center my-2">
                Add Publisher
            </h2>
            <form className="rounded-xl border border-slate-500 p-4 dark:bg-gray-800 bg-sky-200">
                <label
                    htmlFor="publisherName"
                    className="block font-semibold dark:text-white"
                >
                    Publisher Name
                </label>
                <input
                    type="text"
                    name="publisherName"
                    id="publisherName"
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 mb-3"
                    onChange={(e) => setPublisherName(e.target.value)}
                    value={publisherName ?? ""}
                />
                {editMode ? (
                    <button
                        onClick={(e) => handleEditPublisher(e)}
                        type="submit"
                        className="postSubmitBtn mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        Edit
                    </button>
                ) : (
                    <button
                        onClick={(e) => handleAddPublisher(e)}
                        type="submit"
                        className="postSubmitBtn mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        Submit
                    </button>
                )}
                {error && (
                    <div className="text-sm text-red-600 text-center mt-4">
                        {error}
                    </div>
                )}
            </form>
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default PublisherEditor;
