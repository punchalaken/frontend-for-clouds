import { configureStore } from "@reduxjs/toolkit";
import usersReducer from '../slices/usersSlice';
import filesReducer from '../slices/filesSlice';


const store = configureStore({
    reducer: {
        users: usersReducer,
        files: filesReducer,
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
