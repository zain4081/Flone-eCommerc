const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
    page: 1,
}
const pageSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        setPage(state, action) {
            state.page = action.payload.page;
        },
        unsetPage(state, action) {
            state.page = action.payload.page;
        }
    },
});

export const { setPage, unsetPage } = pageSlice.actions;
export default pageSlice.reducer;
