type Props = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const DeleteBtnYes = ({ onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className="rounded-md border border-transparent bg-blue-600 px-10 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-green-800 dark:hover:bg-green-900 dark:focus:ring-offset-gray-800 mr-4"
        >
            Yes
        </button>
    );
};

export default DeleteBtnYes;
