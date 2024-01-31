import { configureStore, createSlice } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
}

interface AdminState {
  isLoggedIn: boolean;
}

const initialUserState: UserState = { isLoggedIn: false };
const initialAdminState: AdminState = { isLoggedIn: false };

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      state.isLoggedIn = false;
    },
  },
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      localStorage.removeItem("adminId");
      localStorage.removeItem("token");
      state.isLoggedIn = false;
    },
  },
});

export const { login: userLogin, logout: userLogout } = userSlice.actions;
export const { login: adminLogin, logout: adminLogout } = adminSlice.actions;

export const { actions: userActions } = userSlice;
export const { actions: adminActions } = adminSlice;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    admin: adminSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;


