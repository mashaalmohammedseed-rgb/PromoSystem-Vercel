{
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/register.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/register",
      "dest": "/api/register.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
