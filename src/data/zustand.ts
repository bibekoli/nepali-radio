import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCurrentRadio = create<RadioStore>()(
  persist(
    (set) => ({
      current: null,
      setCurrent: (radio) => {
        set({ current: radio });
      }
    }),
    {
      name: "current-radio",
    }
  )
);
