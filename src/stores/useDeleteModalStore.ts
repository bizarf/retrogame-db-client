import { create } from "zustand";

interface DeleteModalState {
    deleteModal: boolean;
    setDeleteModal: () => void;
    resetDeleteModal: () => void;
    deleteMode: string;
    setDeleteMode: (deleteMode: string) => void;
    id: string;
    setId: (id: string) => void;
}

const useDeleteModalStore = create<DeleteModalState>((set) => ({
    deleteModal: false,
    setDeleteModal: () => set((state) => ({ deleteModal: !state.deleteModal })),
    resetDeleteModal: () => set({ deleteModal: false }),
    deleteMode: "",
    setDeleteMode: (deleteMode: string) => set({ deleteMode }),
    id: "",
    setId: (id: string) => set({ id }),
}));

export default useDeleteModalStore;
