import { MouseEvent, useEffect, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../../stores/useUserStore";
import useEditorStore from "../../../stores/UseEditModeStore";
import { checkAccessToken } from "../../../utilities/authUtils";

type Genre = {
    genre_id: string;
    name: string;
};

type Platform = {
    platform_id: string;
    name: string;
    logo_url: string;
};

type Publisher = {
    publisher_id: string;
    name: string;
};

type Developer = {
    developer_id: string;
    name: string;
};

const GameEditor = () => {
    const [gameTitle, setGameTitle] = useState<string>("");
    const [gameDescription, setGameDescription] = useState<string>("");
    const [gameYear, setGameYear] = useState<string>("");
    const [genreId, setGenreId] = useState<string>("");
    const [platformId, setPlatformId] = useState<string>("");
    const [publisherId, setPublisherId] = useState<string>("");
    const [developerId, setDeveloperId] = useState<string>("");
    const [gameImage, setGameImage] = useState<string>("");

    const [genres, setGenres] = useState<[Genre]>();
    const [platforms, setPlatforms] = useState<[Platform]>();
    const [publishers, setPublishers] = useState<[Publisher]>();
    const [developers, setDevelopers] = useState<[Developer]>();

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // init universal-cookie
    const cookies = new Cookies();
    // init useNavigate
    const navigate = useNavigate();
    // useParams init
    const { game_id } = useParams();

    const { user } = useUserStore();
    const { editMode, setEditMode, resetEditMode } = useEditorStore();

    const handleAddGame = async (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();

        setLoading((state) => !state);
        const data = {
            title: gameTitle,
            description: gameDescription,
            release_year: parseInt(gameYear),
            genre_id: parseInt(genreId),
            platform_id: parseInt(platformId),
            publisher_id: parseInt(publisherId),
            developer_id: parseInt(developerId),
            image_url: gameImage,
        };

        try {
            await checkAccessToken();
            const access_token = cookies.get("jwt_access_token");

            fetch("https://retrogame-db-python-api.onrender.com/game", {
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
                        navigate("/");
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
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

    const handleEditGame = async (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.preventDefault();

        setLoading((state) => !state);
        const data = {
            title: gameTitle,
            description: gameDescription,
            release_year: parseInt(gameYear),
            genre_id: parseInt(genreId),
            platform_id: parseInt(platformId),
            publisher_id: parseInt(publisherId),
            developer_id: parseInt(developerId),
            image_url: gameImage,
        };

        await checkAccessToken();
        const access_token = cookies.get("jwt_access_token");

        fetch(`https://retrogame-db-python-api.onrender.com/game/${game_id}`, {
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
                    // navigate("/");
                    navigate(-1);
                } else {
                    setError(data.detail.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchGenres = () => {
        fetch("https://retrogame-db-python-api.onrender.com/genres")
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

    const fetchPlatforms = () => {
        fetch("https://retrogame-db-python-api.onrender.com/platforms")
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

    const fetchPublishers = () => {
        fetch("https://retrogame-db-python-api.onrender.com/publishers")
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

    const fetchDevelopers = () => {
        fetch("https://retrogame-db-python-api.onrender.com/developers")
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

    const fetchGameData = () => {
        fetch(`https://retrogame-db-python-api.onrender.com/game/${game_id}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.detail.success) {
                    setGameTitle(data.detail.game.title);
                    setGameDescription(data.detail.game.description);
                    setGameYear(data.detail.game.release_year);
                    setGenreId(data.detail.game.genre_id);
                    setPlatformId(data.detail.game.platform_id);
                    setDeveloperId(data.detail.game.developer_id);
                    setPublisherId(data.detail.game.publisher_id);
                    setGameImage(data.detail.game.image_url);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchGenres();
        fetchPlatforms();
        fetchPublishers();
        fetchDevelopers();

        if (game_id) {
            setEditMode();
            fetchGameData();
        }

        if (user?.role != "admin") {
            navigate("/");
        }

        return () => {
            resetEditMode();
        };
    }, [game_id]);

    return (
        <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center my-2">
                Add Game
            </h2>
            <form className="rounded-xl border border-slate-500 p-4 dark:bg-gray-800 mb-6 bg-sky-200">
                <label
                    htmlFor="gameName"
                    className="block font-semibold dark:text-white"
                >
                    Name
                </label>
                <input
                    type="text"
                    name="gameName"
                    id="gameName"
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 mb-3"
                    onChange={(e) => setGameTitle(e.target.value)}
                    value={gameTitle ?? ""}
                />
                <label
                    htmlFor="gameDescription"
                    className="block font-semibold dark:text-white"
                >
                    Description
                </label>
                <textarea
                    name="gameDescription"
                    id="gameDescription"
                    rows={6}
                    maxLength={2000}
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 mb-3"
                    onChange={(e) => setGameDescription(e.target.value)}
                    value={gameDescription ?? ""}
                ></textarea>
                <label
                    htmlFor="gameYear"
                    className="block font-semibold dark:text-white"
                >
                    Year
                </label>
                <input
                    type="number"
                    name="gameYear"
                    id="gameYear"
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 mb-3"
                    onChange={(e) => setGameYear(e.target.value)}
                    value={gameYear ?? ""}
                />
                <label
                    htmlFor="gameGenre"
                    className="block font-semibold dark:text-white"
                >
                    Genre
                </label>
                <select
                    name="genres"
                    id="genres"
                    className="block font-semibold p-1 rounded dark:bg-slate-900 dark:text-white text-sm mb-3"
                    onChange={(e) => setGenreId(e.target.value)}
                    value={genreId ?? ""}
                >
                    <option value={""} disabled>
                        Please select an option
                    </option>
                    {genres &&
                        genres.map((genre) => {
                            return (
                                <option
                                    key={genre.genre_id}
                                    value={genre.genre_id}
                                >
                                    {genre.name}
                                </option>
                            );
                        })}
                </select>
                <label
                    htmlFor="gamePlatform"
                    className="block font-semibold dark:text-white"
                >
                    Platform
                </label>
                <select
                    name="platforms"
                    id="platforms"
                    className="block font-semibold p-1 rounded dark:bg-slate-900 dark:text-white text-sm mb-3"
                    onChange={(e) => setPlatformId(e.target.value)}
                    value={platformId ?? ""}
                >
                    <option value={""} disabled>
                        Please select an option
                    </option>
                    {platforms &&
                        platforms.map((platform) => {
                            return (
                                <option
                                    key={platform.platform_id}
                                    value={platform.platform_id}
                                >
                                    {platform.name}
                                </option>
                            );
                        })}
                </select>
                <label
                    htmlFor="gameDeveloper"
                    className="block font-semibold dark:text-white"
                >
                    Developer
                </label>
                <select
                    name="developers"
                    id="developers"
                    className="block font-semibold p-1 rounded dark:bg-slate-900 dark:text-white text-sm mb-3"
                    onChange={(e) => setDeveloperId(e.target.value)}
                    value={developerId ?? ""}
                >
                    <option value={""} disabled>
                        Please select an option
                    </option>
                    {developers &&
                        developers.map((developer) => {
                            return (
                                <option
                                    key={developer.developer_id}
                                    value={developer.developer_id}
                                >
                                    {developer.name}
                                </option>
                            );
                        })}
                </select>
                <label
                    htmlFor="gamePublisher"
                    className="block font-semibold dark:text-white"
                >
                    Publisher
                </label>
                <select
                    name="publishers"
                    id="publishers"
                    className="block font-semibold p-1 rounded dark:bg-slate-900 dark:text-white text-sm mb-3"
                    onChange={(e) => setPublisherId(e.target.value)}
                    value={publisherId ?? ""}
                >
                    <option value={""} disabled>
                        Please select an option
                    </option>
                    {publishers &&
                        publishers.map((publisher) => {
                            return (
                                <option
                                    key={publisher.publisher_id}
                                    value={publisher.publisher_id}
                                >
                                    {publisher.name}
                                </option>
                            );
                        })}
                </select>
                <label
                    htmlFor="gameImage"
                    className="block font-semibold dark:text-white"
                >
                    Image URL
                </label>
                <input
                    type="text"
                    name="gameLogo"
                    id="gameLogo"
                    className="block w-full rounded-md border-gray-400 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 mb-3"
                    onChange={(e) => setGameImage(e.target.value)}
                    value={gameImage ?? ""}
                />
                {editMode ? (
                    <button
                        onClick={(e) => handleEditGame(e)}
                        type="submit"
                        className="postSubmitBtn mt-3 rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800"
                    >
                        Edit
                    </button>
                ) : (
                    <button
                        onClick={(e) => handleAddGame(e)}
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

export default GameEditor;
