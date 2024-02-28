import { configureStore } from "@reduxjs/toolkit";
import userDetailsSlice from "./slice/userDetails";

const store = configureStore({
    reducer: {
        userDetailsSlice
    }
});

export type RootState = ReturnType<typeof store.getState>
export default store;