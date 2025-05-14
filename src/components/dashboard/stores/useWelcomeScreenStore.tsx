import { create } from "zustand";

interface WelcomeScreenStore {
  isWelcomeScreen: boolean;
  setIsWelcomeScreen: (isWelcomeScreen: boolean) => void;
}

const useWelcomeScreenStore = create<WelcomeScreenStore>(set => ({
  isWelcomeScreen: true,
  setIsWelcomeScreen: isWelcomeScreen => {
    set({ isWelcomeScreen });
  },
}));

export default useWelcomeScreenStore;
