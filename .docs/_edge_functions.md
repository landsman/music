# Edge Functions

Basically the same as AWS Lambda, but much better integrated in the whole system. Check [Supabase Documentation](https://supabase.com/docs/guides/functions).

Code is located in: `./supabase/functions/*`.

Each function can run a very short time (up to 2s) then it's terminated. So it's good to write small scripts with pagination. Database can give you great tooling for that.

Unexpected errors are handled by Sentry. That works good. What should be tweaked is notification about terminated function. It can be done probably by event pushing to Sentry as well.



