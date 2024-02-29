import { MouseEvent, useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../../stores/useUserStore";
import useEditorStore from "../../../stores/UseEditModeStore";
import { checkAccessToken } from "../../../utilities/authUtils";

const DeveloperEditor = () => {
    const [developerName, setDeveloperName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // init universal-cookie
    const cookies = new Cookies();
    // init useNavigate
    const navigate = useNavigate();
    // useParams init
    const { developer_id } = useParams();
    const { user } = useUserStore();
    const { editMode, setEditMode, resetEditMode } = useEditorStore();

    const handleAddDeveloper = async (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();

        setLoading((state) => !state);
        const data = {
            name: developerName,
        };

        try {
            await checkAccessToken();
            const access_token = cookies.get("jwt_access_token");

            fetch(`${import.meta.env.VITE_API_HOST}/developer`, {
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
                        navigate("/developers");
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

    const handleEditDeveloper = async (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();

        setLoading((state) => !state);
        const data = {
            name: developerName,
        };

        await checkAccessToken();
        const access_token = cookies.get("jwt_access_token");

        fetch(`${import.meta.env.VITE_API_HOST}/developer/${developer_id}`, {
            method: "PUT",
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
                    navigate("/developers");
                } else {
                    setError(data.detail.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchDeveloperData = (developer_id: string) => {
        fetch(`${import.meta.env.VITE_API_HOST}/developer-data/${developer_id}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setDeveloperName(data.detail.developer.name);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (developer_id) {
            setEditMode();
            fetchDeveloperData(developer_id);
        }

        if (user && user.role != "admin") {
            navigate("/developers");
        }

        return () => {
            resetEditMode();
        };
    }, [developer_id]);

    return (
        <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center my-2">
                Add Developer
            </h2>
            <form className="rounded-xl border border-slate-500 p-4 dark:bg-gray-800 bg-sky-200">
                <label
                    htmlFor="developerName"
                    className="block font-semibold dark:text-white"
                >
                    Developer Name
                </label>
                <input
                    type="text"
                    name="developerName"
                    id="developerName"
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 mb-3"
                    onChange={(e) => setDeveloperName(e.target.value)}
                    value={developerName ?? ""}
                />
                {editMode ? (
                    <button
                        onClick={(e) => handleEditDeveloper(e)}
                        type="submit"
                        className="postSubmitBtn mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        Edit
                    </button>
                ) : (
                    <button
                        onClick={(e) => handleAddDeveloper(e)}
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

export default DeveloperEditor;
