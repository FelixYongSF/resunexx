#!/bin/zsh
set -euo pipefail

ROOT_DIRECTORY="${0:A:h:h}"
MOUNT_POINT="${NEXX_CORE_LOCAL_REPLICA_DIR:-$HOME/.resunexx/nexx-core}/mounted-replica"
MODE="${1:-replicate}"
TARGET="${NEXX_CORE_LOCAL_REPLICATION_TARGET:-development}"

case "${TARGET}" in
  development)
    ENV_FILE=".env.local"
    ;;
  staging)
    ENV_FILE=".env.staging.local"
    ;;
  *)
    echo "Nexx Core local replication target must be development or staging." >&2
    exit 2
    ;;
esac

cleanup() {
  if /usr/bin/hdiutil info | /usr/bin/grep -Fq "${MOUNT_POINT}"; then
    /usr/bin/hdiutil detach "${MOUNT_POINT}" >/dev/null 2>&1 || /usr/bin/hdiutil detach -force "${MOUNT_POINT}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

cd "${ROOT_DIRECTORY}"
export NEXX_CORE_LOCAL_REPLICATION_TARGET="${TARGET}"

case "${MODE}" in
  replicate)
    /usr/bin/env node --env-file="${ENV_FILE}" --experimental-strip-types scripts/nexx-core-replicate-local.ts
    ;;
  query)
    /usr/bin/env node --env-file="${ENV_FILE}" --experimental-strip-types scripts/nexx-core-query-local-replica.ts
    ;;
  validate-shadow-quality)
    /usr/bin/env node --env-file="${ENV_FILE}" --experimental-strip-types scripts/nexx-core-validate-shadow-quality-dev.ts
    ;;
  *)
    echo "Unsupported local replication mode." >&2
    exit 2
    ;;
esac
