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

## Troubleshooting

- https://github.com/supabase/cli/issues/1996#issuecomment-2091991560