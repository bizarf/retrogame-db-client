import { create } from "zustand";

interface EditorState {
    editMode: boolean;
    setEditMode: () => void;
    resetEditMode: () => void;
}

const useEditorStore = create<EditorState>((set) => ({
    editMode: false,
    setEditMode: () => set((state) => ({ editMode: !state.editMode })),
    resetEditMode: () => set({ editMode: false }),
}));

export default useEditorStore;
