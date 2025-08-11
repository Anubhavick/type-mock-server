import fs from 'fs';
import path from 'path';

export interface ExampleConfig {
  name: string;
  description: string;
  files: {
    [filename: string]: string;
  };
}

export const examples: Record<string, ExampleConfig> = {
  'basic': {
    name: 'Basic API',
    description: 'Simple user and post API with basic types',
    files: {
      'mock-server.config.ts': `export default {
  port: 4000,
  schema: "./types/api.ts",
  routes: {
    "/api/users": "User[]",
    "/api/users/:id": "User",
    "/api/posts": "Post[]",
    "/api/posts/:id": "Post"
  }
};`,
      'types/api.ts': `export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  publishedAt: Date;
}`
    }
  },
  'ecommerce': {
    name: 'E-commerce API',
    description: 'Complete e-commerce API with products, orders, and customers',
    files: {
      'mock-server.config.ts': `export default {
  port: 4000,
  schema: "./types/api.ts",
  routes: {
    "/api/products": "Product[]",
    "/api/products/:id": "Product",
    "/api/orders": "Order[]",
    "/api/orders/:id": "Order",
    "/api/customers": "Customer[]",
    "/api/customers/:id": "Customer"
  }
};`,
      'types/api.ts': `export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  inStock: boolean;
  images: string[];
  tags: string[];
}

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home'
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: number;
  customerId: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  shippingAddress: Address;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}`
    }
  }
};

export function generateExample(exampleName: string, outputDir: string) {
  const example = examples[exampleName];
  if (!example) {
    throw new Error(`Example '${exampleName}' not found. Available: ${Object.keys(examples).join(', ')}`);
  }

  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Generate all files
  Object.entries(example.files).forEach(([filename, content]) => {
    const fullPath = path.join(outputDir, filename);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });
    
    // Write file
    fs.writeFileSync(fullPath, content);
    console.log(`Created: ${fullPath}`);
  });

  console.log(`\n✅ Example '${example.name}' generated in ${outputDir}`);
  console.log(`📝 ${example.description}`);
  console.log(`\nTo get started:`);
  console.log(`  cd ${outputDir}`);
  console.log(`  npm init -y`);
  console.log(`  npm install type-mock-server`);
  console.log(`  npx type-mock-server start`);
}
