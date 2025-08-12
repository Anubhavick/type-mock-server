# 🚀 Type Mock Server

> **Instant type-safe mock APIs from your TypeScript types. Zero config, maximum productivity.**

Stop wasting time setting up mock servers! Type Mock Server automatically generates REST APIs with realistic mock data from your TypeScript interfaces and types. Perfect for frontend development, testing, and rapid prototyping.

##  Features

- ** Type-Driven**: Generate APIs directly from TypeScript interfaces
- ** Smart Mock Data**: Realistic data generation based on field names and types
- ** Zero Config**: Works out of the box with sensible defaults
- ** Hot Reload**: Auto-restart on type/config changes
- ** Auto Documentation**: Built-in Swagger UI and OpenAPI spec
- ** Type-Safe**: Full TypeScript support with intelligent type parsing
- ** Customizable**: Override mock data with custom generators
- ** Fast Setup**: Get running in under 30 seconds

##  Quick Start

### Installation

```bash
npm install -g type-mock-server
# or
npx type-mock-server init my-api
```

### Basic Usage

1. **Define your types** (`types/api.ts`):
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  tags: string[];
  publishedAt: Date;
}
```

2. **Configure your API** (`mock-server.config.ts`):
```typescript
export default {
  port: 4000,
  schema: "./types/api.ts",
  routes: {
    "/api/users": "User[]",
    "/api/users/:id": "User",
    "/api/posts": "Post[]",
    "/api/posts/:id": "Post"
  }
};
```

3. **Start the server**:
```bash
type-mock-server start
```

That's it! Your mock API is running at `http://localhost:4000` 🎉

## 📖 Documentation

### CLI Commands

```bash
# Start the mock server
type-mock-server start

# Start with hot reload
type-mock-server reload

# Initialize new project with examples
type-mock-server init my-project --example ecommerce

# Show available examples
type-mock-server examples

# Show configuration
type-mock-server config

# List all endpoints
type-mock-server endpoints
```

### Configuration Options

```typescript
export default {
  port: 4000,                          // Server port
  schema: "./types/api.ts",             // Path to TypeScript types
  routes: {                            // API endpoints
    "/api/users": "User[]",            // Array of users
    "/api/users/:id": "User",          // Single user
    "/api/posts": "Post[]"             // Array of posts
  },
  overrides: {                         // Custom field overrides
    User: {
      id: () => Math.random() * 1000,
      email: () => `user@example.com`
    }
  }
};
```

### API Features

- **Query Parameters**:
  - `?count=5` - Control array length
  - `?seed=123` - Consistent data with seed
- **Multiple HTTP Methods**: GET and POST supported
- **Smart Field Detection**: Realistic data based on field names
- **Error Handling**: Helpful error messages and debugging

### Built-in Documentation

- **Swagger UI**: `http://localhost:4000/docs`
- **OpenAPI Spec**: `http://localhost:4000/openapi.json`
- **Health Check**: `http://localhost:4000/health`

## 🎯 Use Cases

- **Frontend Development**: Work on UI without backend dependency
- **API Testing**: Generate test data for integration tests
- **Rapid Prototyping**: Quickly validate API designs
- **Demo Applications**: Realistic data for presentations
- **CI/CD**: Mock external services in testing pipelines

## 🛠️ Advanced Usage

### Custom Mock Data

```typescript
// Override specific fields
export default {
  // ...config
  overrides: {
    User: {
      id: () => Math.floor(Math.random() * 1000),
      avatar: () => `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
    }
  }
};
```

### Complex Types Support

- ✅ Interfaces and type aliases
- ✅ Enums and union types
- ✅ Arrays and nested objects
- ✅ Optional properties
- ✅ Generic types (experimental)

## 📚 Examples

### E-commerce API
```bash
type-mock-server init shop --example ecommerce
```

### Blog API
```bash
type-mock-server init blog --example basic
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT © [Anubhavick](https://github.com/Anubhavick)

---

**Made with ❤️ for developers who value their time**

[![npm downloads](https://img.shields.io/npm/dm/type-mock-server.svg)](https://npmjs.com/package/type-mock-server)
[![GitHub stars](https://img.shields.io/github/stars/Anubhavick/type-mock-server.svg)](https://github.com/Anubhavick/type-mock-server)
