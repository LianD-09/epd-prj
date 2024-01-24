import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    client: null,
    status: false,
    messages: []
}

export const mqttSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setClient: (state, actions) => {
            state.client = actions.payload.client;
        },
        setStatus: (state, actions) => {
            state.status = actions.payload
        },
        updateMessages: (state, actions) => {
            const arr = [...state.messages];
            arr.push({ message: actions.payload._getPayloadString(), topic: actions.payload._getDestinationName() });
            state.messages = arr;
        }
    }
})
// Action creators are generated for each case reducer function
export const { setClient, setStatus, updateMessages } = mqttSlice.actions

export default mqttSlice.reducer