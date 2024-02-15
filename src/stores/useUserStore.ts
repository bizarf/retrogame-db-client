import { create } from "zustand";
import UserType from "../types/UserType";

interface UserState {
    user: UserType | undefined;
    setUser: (user: UserType | undefined) => void;
}

const useUserStore = create<UserState>((set) => ({
    user: undefined,
    setUser: (user) => set({ user }),
}));

export default useUserStore;
