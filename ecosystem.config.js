module.exports = {
    apps: [
      {
        name: "vps-agent",
        script: "dist/index.js",
        interpreter: "node",
        interpreter_args: "-r ./alias/alias.js",
        watch: false,
        autorestart: true,
        max_restarts: 5,
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };