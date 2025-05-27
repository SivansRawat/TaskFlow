module.exports = {
  apps: [
    {
      name: "taskflow",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
