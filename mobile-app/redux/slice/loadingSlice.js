import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isOpen: false
}
export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        openLoading: (state) => {
            state.isOpen = true
        },
        closeLoading: (state) => {
            state.isOpen = false
        }
    }
})
// Action creators are generated for each case reducer function
export const { openLoading, closeLoading } = loadingSlice.actions

export default loadingSlice.reducer