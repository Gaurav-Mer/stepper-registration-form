import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormValues } from '../../interfaces/auth';

interface State {
    registerData: FormValues[];
}

const initialState = {
    registerData: [],
};

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        addUserToRegisterList(state: State, action: PayloadAction<any>) {
            if (state.registerData.length > 0) {
                state.registerData.unshift(action.payload.userData);
            } else {
                state.registerData.push(action.payload.userData)
            }
        },
    },
});


export const { addUserToRegisterList } = registerSlice.actions;

export default registerSlice.reducer;
