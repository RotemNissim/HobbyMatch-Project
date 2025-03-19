module.exports = {
  apps: [
    {
      name: "backend",
      script: "/home/st111/Project/HobbyMatch-Project/backend/dist/app.js",
      interpreter: "node",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

