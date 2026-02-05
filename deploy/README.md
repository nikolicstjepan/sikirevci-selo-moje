# Nomad deploy

## Job file

- **Job ID:** `sikirevci-selo-moje`
- **Spec:** `nomad.job.hcl` (in this folder)
- **Domain:** `sikirevci-selo-moje.teuzcode.hr`

## Prerequisites

1. **Data path on client:** `/var/snap/docker/common/nomad/sikirevci-selo-moje/app-data` (bind-mounted as `/app/app-data` in the container).

2. **Nomad variable** `nomad/jobs/sikirevci-selo-moje` with:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `S3_ACCESS_KEY_ID`, `S3_ACCESS_KEY`
   - `LOGSNAG_ACCESS_KEY`

3. **Docker image** pushed to `registry.teuzcode.hr/sikirevci:latest` (registry auth from `nomad/jobs/_shared/registry`). The Dockerfile bakes in `NEXT_PUBLIC_FILE_BASE_PATH` at build time so memory images load correctly; override with `--build-arg NEXT_PUBLIC_FILE_BASE_PATH=...` if needed.

## Deploy

```bash
nomad job validate deploy/nomad.job.hcl
nomad job plan deploy/nomad.job.hcl
nomad job run deploy/nomad.job.hcl
```

## Local dev

Ensure `.env` includes `DATABASE_URL="file:./db.sqlite"` (see `.env-example`). Prisma uses this for both local and Nomad (Nomad sets `file:/app/app-data/db.sqlite`).
