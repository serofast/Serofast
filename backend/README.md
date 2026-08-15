# SeroFast Secure Backend Module

This folder provides server-side authentication, authorization, and database services for **SeroFast Shop Owners**.

## Folder Structure

```
backend/
├── config/
│   └── supabaseClient.js      # Isolated Supabase client initializer
├── services/
│   ├── authService.js         # Shop Owner registration & auth (`public.shop_owners`)
│   └── shopService.js         # Shop creation & settings management (`public.shops`)
├── .env.backend.example       # Backend secrets template
└── README.md                  # Security documentation
```

## Security Best Practices

1. **Service Role Key Isolation**:
   - The Supabase Service Role key has full bypass capability for Row Level Security (RLS). **Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend bundles or `import.meta.env`**.
2. **Dedicated Table Separation**:
   - Shop Owner registrations are isolated in `public.shop_owners` and never mixed with standard student user records in `public.profiles`.
3. **Environment Security**:
   - Ensure `backend/.env` is added to `.gitignore` so server secrets are never uploaded to Git repositories.
