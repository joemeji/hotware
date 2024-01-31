import { ShippingCategoryState, ShippingEquipmentState } from "@/types/ShippingEquipment";
import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  equipments?: ShippingEquipmentState[]
  categories?: ShippingCategoryState[]
}

// Initial state
const initialState: InitialStateType = {
  equipments: [],
  categories: [],
};

// Actual Slice
export const shippingItemSlice = createSlice({
  name: "shipping_item",
  initialState,
  reducers: {
    setAllItems(state, { payload }) {
      state.equipments = payload.equipments;
      state.categories = payload.categories;
    },
  },
});

export const { setAllItems } = shippingItemSlice.actions;

export default shippingItemSlice.reducer;