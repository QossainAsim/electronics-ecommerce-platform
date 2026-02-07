import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  title: string;
  price: number;
  image: string;
  amount: number;
  deal?: {
    id: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
  } | null;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set) => ({
      products: [],
      allQuantity: 0,
      total: 0,
      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find(
            (item) => item.id === newProduct.id
          );
          if (!cartItem) {
            return { products: [...state.products, newProduct] };
          } else {
            state.products.map((product) => {
              if (product.id === cartItem.id) {
                product.amount += newProduct.amount;
              }
            });
          }
          return { products: [...state.products] };
        });
        
        // ✅ Auto-calculate totals after adding
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            // ✅ Use discounted price if deal exists
            const itemPrice = item.deal 
              ? item.price * (1 - item.deal.discountPercent / 100)
              : item.price;
            total += item.amount * itemPrice;
          });

          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },
      clearCart: () => {
        set(() => {
          return {
            products: [],
            allQuantity: 0,
            total: 0,
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => {
          state.products = state.products.filter(
            (product: ProductInCart) => product.id !== id
          );
          return { products: state.products };
        });
        
        // ✅ Auto-calculate totals after removing
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            const itemPrice = item.deal 
              ? item.price * (1 - item.deal.discountPercent / 100)
              : item.price;
            total += item.amount * itemPrice;
          });

          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },

      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            // ✅ Use discounted price if deal exists
            const itemPrice = item.deal 
              ? item.price * (1 - item.deal.discountPercent / 100)
              : item.price;
            total += item.amount * itemPrice;
          });

          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },
      updateCartAmount: (id, amount) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === id);

          if (!cartItem) {
            return { products: [...state.products] };
          } else {
            state.products.map((product) => {
              if (product.id === cartItem.id) {
                product.amount = amount;
              }
            });
          }

          return { products: [...state.products] };
        });
        
        // ✅ Auto-calculate totals after updating
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            const itemPrice = item.deal 
              ? item.price * (1 - item.deal.discountPercent / 100)
              : item.price;
            total += item.amount * itemPrice;
          });

          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },
    }),
    {
      name: "products-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);