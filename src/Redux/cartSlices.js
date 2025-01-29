import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const cartSlices = createSlice({
  name: "cart",
  initialState: {},
  reducers: {
    addToCart: (state, action) => {
      const {
        userId,
        productName,
        id,
        image,
        variant,
        discount,
        brandDiscount,
        categoryDiscount,
        productDiscount,
      } = action.payload;

      if (!state[userId]) {
        state[userId] = [];
      }

      const userCart = state[userId];

      const productExists = userCart.find(
        (item) => item.productName == productName
      );

      let variantExists;

      if (productExists) {
        variantExists = productExists.variants.find(
          (v) => v.s_k_u == variant.s_k_u
        );
      }

      if (variantExists) {
        variantExists.count += variant.count;
        variantExists.totalPrice += variant.totalPrice;
        variantExists.remaining_quantity = variant.remaining_quantity;
      } else if (productExists) {
        productExists.variants.push(variant);
      } else {
        userCart.push({
          discount,
          brandDiscount,
          categoryDiscount,
          productDiscount,
          productName,
          id,
          image,
          variants: [variant],
        });
      }
    },
    clearCart: (state, action) => {
      const { userId } = action.payload;
      state[userId] = [];
    },
    removeFromCart: (state, action) => {
      const { userId, id, s_k_u } = action.payload;

      const userCart = state[userId];
      const productIndex = userCart.findIndex((e) => e.id === id);

      if (productIndex !== -1) {
        const productExist = userCart[productIndex];

        const updatedVariants = productExist.variants.filter(
          (v) => v.s_k_u !== s_k_u
        );

        if (updatedVariants.length === 0) {
          userCart.splice(productIndex, 1);
          toast.success("Product removed successfully");
        } else {
          userCart[productIndex] = {
            ...productExist,
            variants: updatedVariants,
          };
          toast.success("Variant removed successfully");
        }
      }
    },
    increaseCounter: (state, action) => {
      const { userId, id, s_k_u } = action.payload;
      const userCart = state[userId];
      const productIndex = userCart.findIndex((e) => e.id === id);
      if (productIndex === -1) {
        return;
      }

      const productExist = userCart[productIndex];

      const variant = productExist.variants.find((v) => v.s_k_u === s_k_u);

      if (!variant) {
        return;
      }

      if (variant.count < variant.remaining_quantity) {
        variant.count += 1;
      }

      variant.totalPrice = variant.count * variant.selling_price_per_unit_pkr;
    },

    decreaseCounter: (state, action) => {
      const { userId, id, s_k_u } = action.payload;

      const userCart = state[userId];
      const productIndex = userCart.findIndex((e) => e.id === id);

      if (productIndex !== -1) {
        const productExist = userCart[productIndex];

        productExist.variants.forEach((v) => {
          if (v.s_k_u === s_k_u && v.count > 1) {
            v.count -= 1;
            v.totalPrice = v.count * v.selling_price_per_unit_pkr;
          }
        });
      }
    },
  },
});

export const {
  addToCart,
  clearCart,
  removeFromCart,
  increaseCounter,
  decreaseCounter,
} = cartSlices.actions;
export default cartSlices.reducer;
