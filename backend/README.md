Backend quick start

1. copy `.env.example` to `.env` and fill `DATABASE_URL`, `JWT_SECRET`, and `ADMIN_PASSWORD_HASH`.
2. to create password hash in node REPL:

```bash
node -e "console.log(require('bcrypt').hashSync('PashuSevak@Vaani', 10))"
```

3. npm install && npm run dev
