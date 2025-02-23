import { addToCart, getAllCart } from "@/actions/cart";
import { getAllNotification } from "@/actions/notification";
import { CartItem, Notification } from "@/lib/type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationStore {
  items: Notification[];
  addingStatus: string;
  total: number;
}

const initialState: NotificationStore = {
  items: [],
  addingStatus: "idle",
  total: 0,
};

export const getAllNotificationThunk = createAsyncThunk("getAllNotification", async (artId: string, thunkApi) => {
  const res = await getAllNotification();
  if (!res.success) {
    thunkApi.rejectWithValue(res.message);
    return;
  }
  return res.data;
});

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    getAllNotificationState: (state, actions: PayloadAction<String>) => {},
  },
  extraReducers(builder) {
    builder
      .addCase(getAllNotificationThunk.pending, (state) => {
        state.addingStatus = "adding";
      })
      .addCase(getAllNotificationThunk.fulfilled, (state, actions) => {
        state.addingStatus = "idle";
        if (actions.payload != undefined) {
          state.items = actions.payload;
        }
      })
      .addCase(getAllNotificationThunk.rejected, (state, actions) => {
        state.addingStatus = "idle";
      });
  },
});

export const { getAllNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
