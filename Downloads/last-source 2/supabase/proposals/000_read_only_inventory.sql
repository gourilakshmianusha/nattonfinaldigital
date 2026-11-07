-- READ ONLY. Run on the app's existing project before reviewing the proposed migration.
BEGIN READ ONLY;
SELECT current_database(),current_setting('server_version');
SELECT schema_name FROM information_schema.schemata ORDER BY 1;
SELECT table_schema,table_name,column_name,data_type,is_nullable,column_default FROM information_schema.columns WHERE table_schema NOT IN ('pg_catalog','information_schema') ORDER BY 1,2,ordinal_position;
SELECT n.nspname,c.relname,c.relrowsecurity,c.relforcerowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE c.relkind IN ('r','p') AND n.nspname NOT IN ('pg_catalog','information_schema') ORDER BY 1,2;
SELECT schemaname,tablename,policyname,roles,cmd,qual,with_check FROM pg_policies ORDER BY 1,2,3;
SELECT schemaname,tablename,indexname,indexdef FROM pg_indexes WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY 1,2,3;
SELECT connamespace::regnamespace,conname,conrelid::regclass,pg_get_constraintdef(oid) FROM pg_constraint WHERE connamespace::regnamespace::text NOT IN ('pg_catalog','information_schema') ORDER BY 1,2;
SELECT n.nspname,p.proname,pg_get_function_identity_arguments(p.oid),md5(pg_get_functiondef(p.oid)) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE p.prokind='f' AND n.nspname IN ('public','auth','storage') ORDER BY 1,2,3;
SELECT event_object_schema,event_object_table,trigger_name,action_statement FROM information_schema.triggers ORDER BY 1,2,3;
SELECT extname,extversion FROM pg_extension ORDER BY 1;
SELECT id,name,public,file_size_limit,allowed_mime_types FROM storage.buckets ORDER BY id;
SELECT grantee,table_schema,table_name,privilege_type FROM information_schema.table_privileges WHERE table_schema='public' ORDER BY 1,2,3,4;
COMMIT;
-- No auth.users, contacts, applicants, content, or protected record values are read.
