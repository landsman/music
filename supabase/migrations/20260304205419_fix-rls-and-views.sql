-- Fix 1: Enable RLS on tables that have policies but RLS was not enabled
ALTER TABLE public.artist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hooman_artist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listened ENABLE ROW LEVEL SECURITY;

-- Fix 2: Switch views from SECURITY DEFINER to SECURITY INVOKER
-- This makes views respect the querying user's RLS policies.
-- Anonymous (unauthenticated) users will still get read access via the select_public policies.
ALTER VIEW public.listened_by_michal SET (security_invoker = true);
ALTER VIEW public.listened_by_kacka SET (security_invoker = true);
ALTER VIEW public.listened_count SET (security_invoker = true);
ALTER VIEW public.hooman_artist_most_listened SET (security_invoker = true);
ALTER VIEW public.hooman_tracks_most_listened SET (security_invoker = true);
ALTER VIEW public.hooman_artist_count SET (security_invoker = true);
ALTER VIEW public.hooman_artist_match SET (security_invoker = true);
