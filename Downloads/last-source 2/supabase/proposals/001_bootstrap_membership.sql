-- Operator-only template, after live inventory and the additive migration are verified.
-- Supply admin_user_id as a psql variable containing an EXISTING authorised Auth user's UUID.
-- This inserts only new application membership/profile rows. It does not create Auth users.
BEGIN;
INSERT INTO public.nd_admin_v1_memberships(user_id,role_id,active) VALUES (:'admin_user_id'::uuid,'super_admin',true);
INSERT INTO public.nd_admin_v1_profiles(user_id,display_name) VALUES (:'admin_user_id'::uuid,'Workspace administrator');
COMMIT;
