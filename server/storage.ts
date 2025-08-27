import { type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();

    // Initialize with WuWei kimono products
    this.initializeProducts();
  }

  private initializeProducts() {
    const kimonos: InsertProduct[] = [
      {
        name: "My Brain Has Too Many Tabs Open",
        description: "Perfect for those with busy minds! This vibrant kimono celebrates the beautiful chaos of neurodivergent thinking.",
        price: "89.99",
        image: "/api/assets/wuwei-5.png",
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        inStock: 15,
        category: "kimono",
        featured: 1,
      },
      {
        name: "My Brain Has Too Many Tabs Open - Rainbow",
        description: "The rainbow edition of our popular design! Celebrate neurodiversity with this colorful, rainbow-sleeved kimono.",
        price: "94.99",
        image: "/api/assets/wuwei-6.png",
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        inStock: 12,
        category: "kimono",
        featured: 1,
      },
      {
        name: "My Brain Has Too Many Tabs Open - Purple",
        description: "Bold and beautiful purple kimono perfect for expressing your neurodivergent pride in style.",
        price: "92.99",
        image: "/api/assets/wuwei-7.png",
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        inStock: 18,
        category: "kimono",
        featured: 1,
      },
      {
        name: "Please Hold, Electric Meatball is Malfunctioning",
        description: "A humorous take on brain fog days! This bright blue kimono is perfect for those challenging moments.",
        price: "91.99",
        image: "/api/assets/wuwei-8.png",
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        inStock: 20,
        category: "kimono",
        featured: 1,
      },
      {
        name: "Please Hold While My Electric Meatball is Malfunctioning",
        description: "The black edition with colorful accents - perfect for expressing your neurodivergent humor.",
        price: "93.99",
        image: "/api/assets/wuwei-9.png",
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        inStock: 14,
        category: "kimono",
        featured: 0,
      },
    ];

    kimonos.forEach(async (kimono) => {
      await this.createProduct(kimono);
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured === 1);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      inStock: insertProduct.inStock ?? 10,
      category: insertProduct.category ?? 'kimono',
      featured: insertProduct.featured ?? 0,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item with same product and size already exists
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertItem.sessionId && 
              item.productId === insertItem.productId && 
              item.size === insertItem.size
    );

    if (existingItem) {
      // Update quantity instead of creating new item
      return this.updateCartItemQuantity(existingItem.id, existingItem.quantity + (insertItem.quantity ?? 1)) as Promise<CartItem>;
    }

    const id = randomUUID();
    const cartItem: CartItem = {
      ...insertItem,
      id,
      quantity: insertItem.quantity ?? 1,
      createdAt: new Date(),
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id]) => id);
    
    itemsToRemove.forEach(id => this.cartItems.delete(id));
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status ?? 'pending',
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();
