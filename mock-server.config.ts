export default {
  port: 4000,
  schema: "./src/types/api.ts",
  routes: {
    "/api/users": "User[]",
    "/api/users/:id": "User",
    "/api/posts": "Post[]",
    "/api/posts/:id": "Post",
    "/api/health": "ApiResponse<string>"
  },
  // Optional: Custom overrides for specific fields
  overrides: {
    User: {
      id: () => Math.floor(Math.random() * 1000) + 1,
      email: () => `user${Math.floor(Math.random() * 100)}@example.com`
    }
  }
};
