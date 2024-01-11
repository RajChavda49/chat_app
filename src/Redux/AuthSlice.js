import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleChangeUser: (state, { payload }) => {
      state.user = payload;
    },
  },
});

export const { handleChangeUser } = AuthSlice.actions;

export default AuthSlice.reducer;
