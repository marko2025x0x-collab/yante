import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleSterilization: (cartItemId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getSterilizationTotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        // Build composite key: productId + variantId + anodizationId + isSterilized
        const cartItemId = `${newItem.productId}-${newItem.variantId}-${newItem.anodizationId}-${newItem.isSterilized}`;
        
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.cartItemId === cartItemId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += newItem.quantity;
            return { items: updated, isOpen: true };
          }
          return {
            items: [...state.items, { ...newItem, cartItemId }],
            isOpen: true,
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      toggleSterilization: (cartItemId) => {
        set((state) => {
          const item = state.items.find((i) => i.cartItemId === cartItemId);
          if (!item) return state;

          const updatedSterilized = !item.isSterilized;
          const newCartItemId = `${item.productId}-${item.variantId}-${item.anodizationId}-${updatedSterilized}`;

          // Replace or merge
          const existingSame = state.items.find((i) => i.cartItemId === newCartItemId);
          if (existingSame) {
            return {
              items: state.items
                .filter((i) => i.cartItemId !== cartItemId)
                .map((i) =>
                  i.cartItemId === newCartItemId
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                ),
            };
          }

          return {
            items: state.items.map((i) =>
              i.cartItemId === cartItemId
                ? { ...i, isSterilized: updatedSterilized, cartItemId: newCartItemId }
                : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getSterilizationTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.isSterilized ? 50 * item.quantity : 0),
          0
        );
      },

      getTotal: () => {
        return get().getSubtotal() + get().getSterilizationTotal();
      },
    }),
    {
      name: 'yanti-cart-storage',
    }
  )
);
