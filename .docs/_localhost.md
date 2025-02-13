# Localhost

- [Podman](_podman.md)

## Commands

**start local dev server basd on docker**

```bash
supabase start
```

**run server to allow you to invoke Edge Functions locally**

```bash
supabase functions serve --no-verify-jwt
```

**deploy modified function**

```bash
supabase functions deploy --project-ref xxx
```