import githubMarkWhite from "../../assets/svg/github-mark-white.svg";

const Footer = () => {
    return (
        <footer className="inline-flex flex-shrink-0 justify-center border-t-2 py-1 text-sm dark:border-t-0 dark:bg-gray-800 dark:text-white">
            <a
                href="https://github.com/bizarf"
                className="inline-flex items-center"
            >
                Created by Tony Hoong{" "}
                <img src={githubMarkWhite} className="mx-2 w-6" />
                2024
            </a>
        </footer>
    );
};

export default Footer;
