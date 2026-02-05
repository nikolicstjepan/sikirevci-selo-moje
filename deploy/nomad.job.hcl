# Sikirevci Selo Moje - Next.js app (memories, auth, Prisma/SQLite)
# Deploy: nomad job plan deploy/nomad.job.hcl && nomad job run deploy/nomad.job.hcl
#
# Prerequisites:
# - Client path for data: /var/snap/docker/common/nomad/<job_id>/app-data (bind-mounted into container).

job "sikirevci" {
  datacenters = ["teuz1"]
  type        = "service"

  meta {
    domain = "sikirevci.com.hr"
  }

  group "app" {
    count = 1

    network {
      port "http" {
        static       = 5999
        to           = 3000
        host_network = "loopback"
      }
    }

    task "server" {
      driver = "docker"

      config {
        image   = "registry.teuzcode.hr/sikirevci.com.hr:latest"
        ports   = ["http"]
        volumes = [
          "/var/snap/docker/common/nomad/sikirevci.com.hr/app-data:/app/app-data",
        ]

        auth {
          username = "${DOCKER_USERNAME}"
          password = "${DOCKER_PASSWORD}"
        }

        logging {
          type = "json-file"
          config = {
            tag = "${NOMAD_META_domain}"
          }
        }
      }

      env {
        PORT                     = "3000"
        HOSTNAME                 = "0.0.0.0"
        NEXTAUTH_URL             = "https://${NOMAD_META_domain}"
        UPLOADS_FOLDER           = "/app/app-data/uploads"
        DATABASE_URL             = "file:/app/app-data/db.sqlite"
        EMAIL_API_URL            = "ttps://nikolicstjepan-teuz-email.deno.dev/api/send-email"
        EMAIL_FROM               = "info@teuzcode.hr"
        NEXT_PUBLIC_FILE_BASE_PATH = "https://eu2.contabostorage.com/5d5c7bc98ba045af8a7a1e2bc04e891e:sikirevci/sikirevci"
      }

      template {
        data = <<EOH
{{ with nomadVar "nomad/jobs/sikirevci" }}
GOOGLE_CLIENT_ID="{{ .GOOGLE_CLIENT_ID }}"
GOOGLE_CLIENT_SECRET="{{ .GOOGLE_CLIENT_SECRET }}"
SALT="{{ .SALT }}"
FACEBOOK_CLIENT_ID="{{ .FACEBOOK_CLIENT_ID }}"
FACEBOOK_CLIENT_SECRET="{{ .FACEBOOK_CLIENT_SECRET }}"
{{ end }}

{{ with nomadVar "nomad/jobs/_shared/registry" }}
LOGSNAG_ACCESS_KEY="{{ .LOGSNAG_ACCESS_KEY }}"
S3_ACCESS_KEY_ID="{{ .S3_ACCESS_KEY_ID }}"
S3_ACCESS_KEY="{{ .S3_ACCESS_KEY }}"
DOCKER_USERNAME="{{ .DOCKER_USERNAME }}"
DOCKER_PASSWORD="{{ .DOCKER_PASSWORD }}"
{{ end }}
EOH
        destination = "secrets/env"
        env         = true
      }

      resources {
        cpu    = 256
        memory = 512
      }
    }
  }
}
