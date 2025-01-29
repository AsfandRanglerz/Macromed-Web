import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    login: false,
    userData: null,
    token: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.login = true;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
    },
    logoutUser: (state, action) => {
      state.login = false;
      state.userData = null;
      state.token = null;
    },
  },
});

export const { logoutUser, loginUser } = userSlice.actions;
export default userSlice.reducer;
