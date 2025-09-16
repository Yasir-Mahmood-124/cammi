import { createSlice, PayloadAction } from "@reduxjs/toolkit";
 
interface SubmenuState {
  clicked: string | null;
}
 
const initialState: SubmenuState = {
  clicked: null,
};
 
const submenuSlice = createSlice({
  name: "submenu",
  initialState,
  reducers: {
    setSubmenuClicked: (state, action: PayloadAction<string | null>) => {
      state.clicked = action.payload;
      if (action.payload) {
        localStorage.setItem("subMenuclicked", action.payload);
      } else {
        localStorage.removeItem("subMenuclicked");
      }
    },
    loadSubmenuFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("subMenuclicked");
        state.clicked = stored ? stored : null;
      }
    },
    clearSubmenu: (state) => {
      state.clicked = null;
      localStorage.removeItem("subMenuclicked");
    },
  },
});
 
export const { setSubmenuClicked, loadSubmenuFromStorage, clearSubmenu } =
  submenuSlice.actions;
 
export default submenuSlice.reducer;