import githubMarkWhite from "../../assets/svg/github-mark-white.svg";
import githubMarkBlack from "../../assets/svg/github-mark.svg";
import useThemeStore from "../../stores/useThemeStore";

const Footer = () => {
    const { theme } = useThemeStore();

    return (
        <footer className="inline-flex flex-shrink-0 justify-center border-t-2 py-1 text-sm dark:border-t-0 dark:bg-gray-800 dark:text-white bg-white">
            <a
                href="https://github.com/bizarf"
                className="inline-flex items-center"
            >
                Created by Tony Hoong{" "}
                {theme === "light" ? (
                    <img
                        src={githubMarkBlack}
                        className="mx-2 w-6"
                        alt="GitHub icon"
                    />
                ) : (
                    <img
                        src={githubMarkWhite}
                        className="mx-2 w-6"
                        alt="GitHub icon"
                    />
                )}
                2024
            </a>
        </footer>
    );
};

export default Footer;
