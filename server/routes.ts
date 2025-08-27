import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema } from "@shared/schema";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.FOURGEEKS_API_TOKEN) {
  throw new Error('Missing required 4Geeks API token: FOURGEEKS_API_TOKEN');
}

const FOURGEEKS_API_BASE = 'https://api.4geeks.io/v1';
const apiHeaders = {
  'Authorization': `Bearer ${process.env.FOURGEEKS_API_TOKEN}`,
  'Content-Type': 'application/json'
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve static assets from both attached_assets and public directory
  app.get("/api/assets/:filename", (req, res) => {
    const filename = req.params.filename;
    const publicPath = path.join(__dirname, "..", "client", "public", filename);
    const assetPath = path.join(__dirname, "..", "attached_assets", filename);
    
    if (fs.existsSync(publicPath)) {
      res.sendFile(publicPath);
    } else if (fs.existsSync(assetPath)) {
      res.sendFile(assetPath);
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  // Get featured products
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching featured products: " + error.message });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Get cart items for session
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const items = await storage.getCartItems(req.params.sessionId);
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product,
          };
        })
      );
      res.json(itemsWithProducts);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching cart: " + error.message });
    }
  });

  // Add item to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      const product = await storage.getProduct(cartItem.productId);
      res.json({
        ...cartItem,
        product,
      });
    } catch (error: any) {
      res.status(400).json({ message: "Error adding to cart: " + error.message });
    }
  });

  // Update cart item quantity
  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItemQuantity(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      const product = await storage.getProduct(cartItem.productId);
      res.json({
        ...cartItem,
        product,
      });
    } catch (error: any) {
      res.status(400).json({ message: "Error updating cart item: " + error.message });
    }
  });

  // Remove item from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error removing from cart: " + error.message });
    }
  });

  // Clear cart
  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error clearing cart: " + error.message });
    }
  });

  // Create payment link with 4Geeks API
  app.post("/api/create-payment-link", async (req, res) => {
    try {
      const { productId, email, cartItems } = req.body;
      
      // Create payment link with 4Geeks
      const response = await fetch(`${FOURGEEKS_API_BASE}/payment-links/`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          product: productId,
          customers: [],
          test: true // Set to false for production
        })
      });

      if (!response.ok) {
        throw new Error(`4Geeks API error: ${response.status}`);
      }

      const data = await response.json();
      res.json({ 
        paymentLink: data.data.link,
        paymentId: data.data.id 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment link: " + error.message });
    }
  });

  // Complete order after successful payment
  app.post("/api/orders", async (req, res) => {
    try {
      const { email, paymentLinkId, total, items, sessionId } = req.body;
      
      // Verify payment with 4Geeks (optional - depends on webhook setup)
      // For now, we'll create the order directly
      const order = await storage.createOrder({
        email,
        stripePaymentIntentId: paymentLinkId, // Reuse field for 4Geeks payment ID
        total: total.toString(),
        items: JSON.stringify(items),
        status: "completed",
      });

      // Clear the cart after successful order
      if (sessionId) {
        await storage.clearCart(sessionId);
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating order: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
