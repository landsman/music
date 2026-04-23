-- Upsert the Supabase anon key into vault.secrets.
-- Executed by scripts/ci/upsert-vault-secret.sh; the anon key is passed via
-- psql's `--set=anon_key=...`, so no secret value is ever stored here.
DO $$
DECLARE
  v_id uuid;
  v_key text := :'anon_key';
BEGIN
  SELECT id INTO v_id FROM vault.secrets WHERE name = 'supabase_anon_key' LIMIT 1;
  IF v_id IS NOT NULL THEN
    PERFORM vault.update_secret(v_id, v_key);
  ELSE
    PERFORM vault.create_secret(v_key, 'supabase_anon_key', 'Supabase anon key for pg_cron HTTP requests');
  END IF;
END $$;
