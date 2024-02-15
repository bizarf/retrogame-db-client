import { useEffect, useState } from "react";

const Platforms = () => {
    const [platforms, setPlatforms] = useState<PostsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPlatforms = () => {
        fetch("http://127.0.0.1:8000/platforms")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setPlatforms(data.allPosts);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPlatforms();
    }, []);

    return <>Hello</>;
};

export default Platforms;
