import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = '/api/hotels';
const getError = (error) => error.response?.data || { message:'An error occurred'};

export const fetchHotels = createAsyncThunk('hotels/fetchAll', async (params, {rejectWithValue}) => {
    try {
        const response = await axios.get(API, { params });
        return response.data;
    } catch (error) {
        return rejectWithValue(getError(error));
    }
});

export const fetchHotelById = createAsyncThunk('hotels/fetchOne', async (id, {rejectWithValue}) => {
    try {
        return (await axios.get(`${API}/${id}`)).data;
    } catch (error) {
        return rejectWithValue(getError(error));
    }
});

export const createHotel = createAsyncThunk('hotels/create', async (formData, {rejectWithValue}) => {
    try {
        return (await axios.post(API, formData)).data;
    } catch (error) {
        return rejectWithValue(getError(error));
    }
});

export const updateHotel = createAsyncThunk('hotels/update', async ({id, formData}, {rejectWithValue}) => {
    try {
        return (await axios.put(`${API}/${id}`, formData)).data;
    } catch (error) {
        return rejectWithValue(getError(error));
    }
});

export const deleteHotel = createAsyncThunk('hotels/delete', async (id, {rejectWithValue}) => {
    try {
        await axios.delete(`${API}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(getError(error));
    }
});

const hotelSlice = createSlice({
    name: 'hotels',
    initialState: {
        items: [],
        total: 0,
        current: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrent: (state) => {
            state.current = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data || [];
                state.total = action.payload.total || 0;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch hotels';
            })
            .addCase(fetchHotelById.pending, (state) => {
                state.loading = true;
                state.current = null;
                state.error = null;
            })
            .addCase(fetchHotelById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })
            .addCase(fetchHotelById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch hotel details';
            })
            .addCase(deleteHotel.fulfilled, (state, action) => {
                state.items = state.items.filter(hotel => hotel.id !== action.payload);
                state.total -= 1;
            })
    },
});

export const { clearCurrent } = hotelSlice.actions;
export default hotelSlice.reducer;