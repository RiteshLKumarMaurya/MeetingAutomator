module.exports = {
  apps: [
    {
      name: "meetingautomator",
      script: "npm",
      args: "start",
      cwd: "/opt/meetingautomator",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
};
