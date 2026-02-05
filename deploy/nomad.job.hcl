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

        task "grafana-dashboard" {
      driver = "docker"

      lifecycle {
        hook    = "prestart"
        sidecar = false
      }

      # secrets/env already provides GRAFANA_TOKEN
      template {
            data = <<EOH
        {{ with nomadVar "nomad/jobs/_shared/registry" }}
        GRAFANA_TOKEN="{{ .GRAFANA_TOKEN }}"
        {{ end }}
        EOH
            destination = "secrets/env"
            env         = true
          }

          env {
            GRAFANA_URL = "https://grafana.teuzcode.hr"
            DOMAIN      = "${NOMAD_META_domain}" # uses job meta
          }

          # This renders the payload Grafana expects: { dashboard: {...}, overwrite: true }
          template {
            destination = "local/dashboard-payload.json"
            data = <<EOH
        {{- $d := env "DOMAIN" -}}
        {{- $uid := printf "logs-%s" (replaceAll "." "-" $d) -}}
        {
          "dashboard": {
            "annotations": {
              "list": [
                {
                  "builtIn": 1,
                  "datasource": { "type": "grafana", "uid": "-- Grafana --" },
                  "enable": true,
                  "hide": true,
                  "iconColor": "rgba(0, 211, 255, 1)",
                  "name": "Annotations & Alerts",
                  "type": "dashboard"
                }
              ]
            },
            "editable": true,
            "fiscalYearStartMonth": 0,
            "graphTooltip": 0,

            "id": null,
            "version": 0,

            "links": [],
            "panels": [
              {
                "datasource": { "type": "loki", "uid": "P8E80F9AEF21F6940" },
                "fieldConfig": { "defaults": {}, "overrides": [] },
                "gridPos": { "h": 7, "w": 24, "x": 0, "y": 0 },
                "id": 3,
                "options": {
                  "dedupStrategy": "none",
                  "enableInfiniteScrolling": false,
                  "enableLogDetails": true,
                  "prettifyLogMessage": false,
                  "showCommonLabels": false,
                  "showLabels": false,
                  "showTime": false,
                  "sortOrder": "Descending",
                  "wrapLogMessage": false
                },
                "pluginVersion": "12.0.1",
                "targets": [
                  {
                    "datasource": { "type": "loki", "uid": "P8E80F9AEF21F6940" },
                    "direction": "backward",
                    "editorMode": "builder",
                    "expr": "{job=\"contabo-sm-apache-all\", filename={{ `\"` }}/var/log/apache2/{{$d}}-access.log{{ `\"` }}} |= ``",
                    "queryType": "range",
                    "refId": "A"
                  }
                ],
                "title": "apache ACCESS",
                "type": "logs"
              },
              {
                "datasource": { "type": "loki", "uid": "P8E80F9AEF21F6940" },
                "fieldConfig": { "defaults": {}, "overrides": [] },
                "gridPos": { "h": 7, "w": 24, "x": 0, "y": 7 },
                "id": 4,
                "options": {
                  "dedupStrategy": "none",
                  "enableInfiniteScrolling": false,
                  "enableLogDetails": true,
                  "prettifyLogMessage": false,
                  "showCommonLabels": false,
                  "showLabels": false,
                  "showTime": false,
                  "sortOrder": "Descending",
                  "wrapLogMessage": false
                },
                "pluginVersion": "12.0.1",
                "targets": [
                  {
                    "datasource": { "type": "loki", "uid": "P8E80F9AEF21F6940" },
                    "direction": "backward",
                    "editorMode": "builder",
                    "expr": "{job=\"contabo-sm-apache-all\", filename={{ `\"` }}/var/log/apache2/{{$d}}-error.log{{ `\"` }}} |= ``",
                    "queryType": "range",
                    "refId": "A"
                  }
                ],
                "title": "apache ERROR",
                "type": "logs"
              },
              {
                "datasource": { "type": "loki", "uid": "P8E80F9AEF21F6940" },
                "fieldConfig": { "defaults": {}, "overrides": [] },
                "gridPos": { "h": 7, "w": 24, "x": 0, "y": 14 },
                "id": 1,
                "options": {
                  "dedupStrategy": "none",
                  "enableInfiniteScrolling": false,
                  "enableLogDetails": true,
                  "prettifyLogMessage": false,
                  "showCommonLabels": false,
                  "showLabels": false,
                  "showTime": false,
                  "sortOrder": "Descending",
                  "wrapLogMessage": false
                },
                "pluginVersion": "12.0.1",
                "targets": [
                  {
                    "datasource": { "type": "loki", "uid": "P8E80F9AEF21F6940" },
                    "direction": "backward",
                    "editorMode": "code",
                    "expr": "{job=\"contabo-sm-docker\"}\n| json\n| stream=\"stdout\"\n| attrs_tag=\"{{$d}}\"\n| line_format {{ `\"` }}{{ "{{" }} substr 0 22 .time {{ "}}" }} - {{ "{{" }} .log {{ "}}" }}{{ `\"` }}",
                    "queryType": "range",
                    "refId": "A"
                  }
                ],
                "title": "OUT",
                "type": "logs"
              },
              {
                "datasource": { "type": "loki", "uid": "P8E80F9AEF21F6940" },
                "fieldConfig": { "defaults": {}, "overrides": [] },
                "gridPos": { "h": 7, "w": 24, "x": 0, "y": 21 },
                "id": 2,
                "options": {
                  "dedupStrategy": "none",
                  "enableInfiniteScrolling": false,
                  "enableLogDetails": true,
                  "prettifyLogMessage": false,
                  "showCommonLabels": false,
                  "showLabels": false,
                  "showTime": false,
                  "sortOrder": "Descending",
                  "wrapLogMessage": false
                },
                "pluginVersion": "12.0.1",
                "targets": [
                  {
                    "datasource": { "type": "loki", "uid": "P8E80F9AEF21F6940" },
                    "direction": "backward",
                    "editorMode": "code",
                    "expr": "{job=\"contabo-sm-docker\"}\n| json\n| stream=\"stderr\"\n| attrs_tag=\"{{$d}}\"\n| line_format {{ `\"` }}{{ "{{" }} substr 0 22 .time {{ "}}" }} - {{ "{{" }} .log {{ "}}" }}{{ `\"` }}",
                    "queryType": "range",
                    "refId": "A"
                  }
                ],
                "title": "ERROR",
                "type": "logs"
              }
            ],
            "preload": false,
            "schemaVersion": 41,
            "tags": [],
            "templating": { "list": [] },
            "time": { "from": "now-6h", "to": "now" },
            "timepicker": {},
            "timezone": "browser",

            "title": "{{ $d }}",
            "uid": "{{ $uid }}"
          },
          "folderUid": "efc9ej33yi9s0c",
          "overwrite": true
        }
        EOH
          }

      config {
        image   = "curlimages/curl:8.6.0"
        command = "sh"
        args = ["-lc", <<EOS
        set -euo pipefail
        # Ensure folder "LOGS" exists (uid=logs); ignore error if already present
        curl -sS -X POST "$GRAFANA_URL/api/folders" \
          -H "Authorization: Bearer $GRAFANA_TOKEN" \
          -H "Content-Type: application/json" \
          -d '{"title":"LOGS","uid":"efc9ej33yi9s0c"}' || true
        curl -sS -X POST "$GRAFANA_URL/api/dashboards/db" \
          -H "Authorization: Bearer $GRAFANA_TOKEN" \
          -H "Content-Type: application/json" \
          --data-binary @"${NOMAD_TASK_DIR}/dashboard-payload.json"
        EOS
        ]
      }
    }

    task "server" {
      driver = "docker"

      config {
        image   = "registry.teuzcode.hr/sikirevci:latest"
        ports   = ["http"]
        volumes = [
          "/var/snap/docker/common/nomad/sikirevci/app-data:/app/app-data",
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
        EMAIL_API_URL            = "https://nikolicstjepan-teuz-email.deno.dev/api/send-email"
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
