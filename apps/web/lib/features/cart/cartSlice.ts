
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { getCart } from '@/services/tourService'

export interface CartState {
    count: number
    loading: boolean
    error: string | null
}

const initialState: CartState = {
    count: 0,
    loading: false,
    error: null,
}

export const fetchCartCount = createAsyncThunk(
    'cart/fetchCount',
    async (_, { rejectWithValue }) => {
        try {
            const cartIdsStr = localStorage.getItem('cartItemId')
            if (!cartIdsStr) return 0

            const ids = cartIdsStr.split(',').map(id => parseInt(id, 10)).filter(n => !isNaN(n))
            if (ids.length === 0) return 0

            const response = await getCart(ids)
            return response.count
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch cart count')
        }
    }
)

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        // Optional: increment helper if we want optimistic updates
        incrementCount: (state) => {
            state.count += 1
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartCount.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCartCount.fulfilled, (state, action) => {
                state.loading = false
                state.count = action.payload
            })
            .addCase(fetchCartCount.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { updateCount, incrementCount } = cartSlice.actions
export default cartSlice.reducer
