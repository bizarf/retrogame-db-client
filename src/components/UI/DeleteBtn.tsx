type Props = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const DeleteBtn = ({ onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
            Delete
        </button>
    );
};

export default DeleteBtn;
