import { create } from "zustand";

interface EditorState {
    editMode: boolean;
    setEditMode: () => void;
    // resetDeleteModal: () => void;
}

const useEditorStore = create<EditorState>((set) => ({
    editMode: false,
    setEditMode: () => set((state) => ({ editMode: !state.editMode })),
}));

export default useEditorStore;
