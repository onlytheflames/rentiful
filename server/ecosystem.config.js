module.exports = {
  apps: [
    {
      name: "rentiful",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
