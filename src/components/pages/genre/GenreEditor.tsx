import { MouseEvent, useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../../stores/useUserStore";
import useEditorStore from "../../../stores/UseEditModeStore";
import { checkAccessToken } from "../../../utilities/authUtils";

const GenreEditor = () => {
    const [genreName, setGenreName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // init universal-cookie
    const cookies = new Cookies();
    // init useNavigate
    const navigate = useNavigate();
    // useParams init
    const { genre_id } = useParams();
    const { user } = useUserStore();
    const { editMode, setEditMode, resetEditMode } = useEditorStore();

    const handleAddGenre = async (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();

        setLoading((state) => !state);
        const data = {
            name: genreName,
        };

        try {
            checkAccessToken();
            const access_token = cookies.get("jwt_access_token");

            fetch("http://127.0.0.1:8000/genre", {
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
                        navigate("/genres");
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

    const handleEditGenre = (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();

        setLoading((state) => !state);
        const data = {
            name: genreName,
        };

        const access_token = cookies.get("jwt_access_token");

        fetch(`http://127.0.0.1:8000/genre/${genre_id}`, {
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
                    navigate("/genres");
                } else {
                    setError(data.detail.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchGenreData = (genre_id: string) => {
        fetch(`http://127.0.0.1:8000/genre-data/${genre_id}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setGenreName(data.detail.genre.name);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (genre_id) {
            setEditMode();
            fetchGenreData(genre_id);
        }

        if (user?.role != "admin") {
            navigate("/genres");
        }

        return () => {
            resetEditMode();
        };
    }, [genre_id]);

    return (
        <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center my-2">
                Add Genre
            </h2>
            <form className="rounded-xl border border-slate-500 p-4 dark:bg-gray-800">
                <label
                    htmlFor="genreName"
                    className="block font-semibold dark:text-white"
                >
                    Genre Name
                </label>
                <input
                    type="text"
                    name="genreName"
                    id="genreName"
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 mb-3"
                    onChange={(e) => setGenreName(e.target.value)}
                    value={genreName ?? ""}
                />
                {editMode ? (
                    <button
                        onClick={(e) => handleEditGenre(e)}
                        type="submit"
                        className="postSubmitBtn mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        Edit
                    </button>
                ) : (
                    <button
                        onClick={(e) => handleAddGenre(e)}
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

export default GenreEditor;
