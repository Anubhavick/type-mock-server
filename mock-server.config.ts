export default {
  port: 4000,
  schema: "./src/types/api.ts",
  routes: {
    "/users": "User[]",
    "/user/:id": "User"
  }
};
