import { addToCart, getAllCart } from "@/actions/cart";
import { CartItem } from "@/lib/type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartStoreState {
  items: CartItem[];
  addingStatus: string;
  total: number;
}

const initialState: CartStoreState = {
  items: [],
  addingStatus: "idle",
  total: 0,
};

export const getAllCartThunk = createAsyncThunk("addToCart", async (artId: string, thunkApi) => {
  const res = await getAllCart();
  if (!res.success) {
    thunkApi.rejectWithValue(res.message);
    return;
  }
  return res.data;
});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartState: (state, actions: PayloadAction<String>) => {},
  },
  extraReducers(builder) {
    builder
      .addCase(getAllCartThunk.pending, (state) => {
        state.addingStatus = "adding";
      })
      .addCase(getAllCartThunk.fulfilled, (state, actions) => {
        state.addingStatus = "idle";
        if (actions.payload != undefined) {
          state.items = actions.payload;
          state.total = actions.payload.reduce((total, item) => total + item.artwork.price, 0);
        }
      })
      .addCase(getAllCartThunk.rejected, (state, actions) => {
        state.addingStatus = "idle";
      });
  },
});

export const { addToCartState } = cartSlice.actions;
export default cartSlice.reducer;
