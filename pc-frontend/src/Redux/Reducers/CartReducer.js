import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [] // List of { product_id, quantity }
};

const CartReducer = createSlice({
  name: "CartReducer",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setProductQuantity: (state, action) => {
      const { product_id, quantity } = action.payload;
      const existing = state.products.find(
        (item) => item.product_id === product_id
      );

      if (existing) {
        if (quantity > 0) {
          existing.quantity = quantity;
        } else {
          // Remove product if quantity is 0 or less
          state.products = state.products.filter(
            (item) => item.product_id !== product_id
          );
        }
      } else if (quantity > 0) {
        state.products.push({ product_id, quantity });
      }
    },

    clearProducts: (state) => {
      state.products = [];
    },
  },
});

export const { setProducts, setProductQuantity, clearProducts } =
  CartReducer.actions;

export const selectTotalCount = (state) =>
  state.CartReducer.products.reduce((sum, item) => sum + item.quantity, 0);

export default CartReducer.reducer;
