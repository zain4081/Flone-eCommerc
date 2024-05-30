const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
    id: "",
    name: "",
    email: "",
    role: "",
    is_phone_verified: "",
}
const userInfoSlice = createSlice({
    name: "user_info",
    initialState,
    reducers: {
        setUserInfo(state, action) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.is_phone_verified = action.payload.is_phone_verified;

        },
        unsetUserInfo(state, action) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.is_phone_verified = action.payload.is_phone_verified;
        },
    },
});

export const { setUserInfo, unsetUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
