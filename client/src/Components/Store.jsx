import { create } from "zustand";

const useStore = create((set) => ({
  membershipSelected: null,
  setMembershipSelected: (membership) =>
    set({ membershipSelected: membership }),
}));

export default useStore;
