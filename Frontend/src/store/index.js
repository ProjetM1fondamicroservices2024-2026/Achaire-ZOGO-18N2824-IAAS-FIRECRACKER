import {createSlice, configureStore} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        isAdmin: false,
        openSnackbar: false,
        msg: "",
        snackbarId: 0 , // Add this to force updates
        
    },
    reducers: {
        login(state) {
            state.isLoggedIn = true;
        },
        setAdmin(state){
            state.isAdmin = true;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.isAdmin = false;
        },
       
       
       
       
    },
});

export const authActions = authSlice.actions;

export const store = configureStore({
    reducer: authSlice.reducer
});