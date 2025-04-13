import { createSlice } from "@reduxjs/toolkit";
// import { act } from "react";

const initialState = {
  user: null, // Holds the user information (if logged in)
  isAuthenticated: false, // Tracks whether the user is logged in
  error: null, // Holds any login/signup errors
  // user: JSON.parse(localStorage.getItem("user")) || null, // Load from localStorage
  // isAuthenticated: localStorage.getItem("user") ? true : false, // Persist authentication
  // error: null, // Holds any login/signup errors
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state,action) => {
    state.user = action.payload
    state.isAuthenticated = true
    // localStorage.setItem("user", JSON.stringify(action.payload)); // Save to localStorage

    },
    signUp: (state, action) => {
      const { email, password } = action.payload;
      state.user = { email, password };
      state.error = null;
      // localStorage.setItem("user", JSON.stringify(state.user)); // Save to localStorage
    },
    login: (state, action) => {
      console.log("Login Payload:", action.payload);
        const user = action.payload;
        if(user){
          state.user = user;
          state.isAuthenticated = true;
          // localStorage.setItem("user", JSON.stringify(user)); // Save to localStorage
        }
        else{
            state.error = "invalid email or password"
        }
      },
      updateUserRole: (state, action) => {
        if (state.user) {
          state.user.role = action.payload;

        }
      },
      updateUser: (state, action) => {
        state.user = { ...state.user, ...action.payload }; // Merge updated data
        localStorage.setItem("user", JSON.stringify(state.user));
      },

    logout: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token")
        // localStorage.removeItem("user");

    },
    setError:(state,action) =>{
        state.error = action.payload;
    }
    
  },
});

export const { setUser, signUp, login, logout,setError,updateUserRole, updateUser} = userSlice.actions;
export default userSlice.reducer;
