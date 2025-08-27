import { createContext, useContext, useEffect, useState } from "react";
import { type Product, type CartItem } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartItemWithProduct extends Omit<CartItem, 'productId'> {
  product: Product;
}

interface CartContextType {
  items: CartItemWithProduct[];
  itemCount: number;
  total: number;
  subtotal: number;
  tax: number;
  isLoading: boolean;
  addToCart: (productId: string, size: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('wuwei-session-id');
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem('wuwei-session-id', newId);
    return newId;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart', sessionId],
    enabled: !!sessionId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, size, quantity = 1 }: { productId: string; size: string; quantity?: number }) => {
      const response = await apiRequest('POST', '/api/cart', {
        sessionId,
        productId,
        size,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      toast({
        title: "Added to Cart",
        description: "Item successfully added to your cart!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const response = await apiRequest('DELETE', `/api/cart/${itemId}`);
        return response.json();
      } else {
        const response = await apiRequest('PUT', `/api/cart/${itemId}`, { quantity });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest('DELETE', `/api/cart/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      toast({
        title: "Item Removed",
        description: "Item removed from your cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', `/api/cart/session/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
  });

  const itemCount = items.reduce((sum: number, item: CartItemWithProduct) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum: number, item: CartItemWithProduct) => 
    sum + (parseFloat(item.product?.price || '0') * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  const contextValue: CartContextType = {
    items: items as CartItemWithProduct[],
    itemCount,
    total,
    subtotal,
    tax,
    isLoading,
    addToCart: (productId, size, quantity) => 
      addToCartMutation.mutate({ productId, size, quantity }),
    updateQuantity: (itemId, quantity) => 
      updateQuantityMutation.mutate({ itemId, quantity }),
    removeItem: (itemId) => removeItemMutation.mutate(itemId),
    clearCart: () => clearCartMutation.mutate(),
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
