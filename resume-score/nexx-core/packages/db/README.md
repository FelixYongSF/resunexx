# Nexx Core Phase 1 database foundation

These PostgreSQL migrations are applied only to the approved non-production
Neon development database. The scripts require
`NEXX_CORE_MIGRATION_TARGET=development` and fail closed for production.

Apply in numeric order through `pnpm run nexx-core:migrate:dev`. Never point
these migrations at the existing ResuNexx production data plane. The local
acceptance tests use an in-memory store and do not require a database.

Before any production Core data:

1. provision separate roles from `roles.sql`;
2. run the migrations in non-production;
3. perform a restore test;
4. complete Gate B approval.
