import { create } from "zustand";

interface DeleteModalState {
    deleteModal: boolean;
    setDeleteModal: () => void;
    resetDeleteModal: () => void;
    deleteMode: string;
    setDeleteMode: (deleteMode: string) => void;
    id: number;
    setId: (id: number) => void;
}

const useDeleteModalStore = create<DeleteModalState>((set) => ({
    deleteModal: false,
    setDeleteModal: () => set((state) => ({ deleteModal: !state.deleteModal })),
    resetDeleteModal: () => set({ deleteModal: false }),
    deleteMode: "",
    setDeleteMode: (deleteMode: string) => set({ deleteMode }),
    id: 0,
    setId: (id: number) => set({ id }),
}));

export default useDeleteModalStore;
