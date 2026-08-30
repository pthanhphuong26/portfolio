#!/usr/bin/env bash

set -euo pipefail

archive_path="${1:-}"

: "${CPANEL_APP_ROOT:?CPANEL_APP_ROOT is required}"
: "${CPANEL_HOST:?CPANEL_HOST is required}"
: "${CPANEL_SSH_PORT:?CPANEL_SSH_PORT is required}"
: "${CPANEL_USER:?CPANEL_USER is required}"
: "${GITHUB_SHA:?GITHUB_SHA is required}"

if [[ ! -f "$archive_path" ]]; then
  echo "Release archive not found: $archive_path" >&2
  exit 1
fi

if [[ ! "$CPANEL_HOST" =~ ^[a-zA-Z0-9.-]+$ ]]; then
  echo "CPANEL_HOST contains unsupported characters." >&2
  exit 1
fi

if [[ ! "$CPANEL_SSH_PORT" =~ ^[0-9]+$ ]]; then
  echo "CPANEL_SSH_PORT must be numeric." >&2
  exit 1
fi

if [[ ! "$CPANEL_USER" =~ ^[a-zA-Z0-9._-]+$ ]]; then
  echo "CPANEL_USER contains unsupported characters." >&2
  exit 1
fi

if [[ ! "$CPANEL_APP_ROOT" =~ ^/home[0-9]*/${CPANEL_USER}/([a-zA-Z0-9._-]+(/[a-zA-Z0-9._-]+)*)$ ]]; then
  echo "CPANEL_APP_ROOT must be a specific path inside CPANEL_USER's home directory." >&2
  exit 1
fi

if [[ ! "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ ]]; then
  echo "GITHUB_SHA is not a full commit SHA." >&2
  exit 1
fi

target="${CPANEL_USER}@${CPANEL_HOST}"
releases_directory="${CPANEL_APP_ROOT}/releases"
release_directory="${releases_directory}/${GITHUB_SHA}"
remote_archive="${releases_directory}/${GITHUB_SHA}.tar.gz"
current_directory="${CPANEL_APP_ROOT}/current"
candidate_directory="${CPANEL_APP_ROOT}/.current-${GITHUB_SHA}"
previous_directory="${CPANEL_APP_ROOT}/.current-previous"

ssh -o BatchMode=yes -p "$CPANEL_SSH_PORT" "$target" \
  "mkdir -p '$releases_directory'"

scp -q -o BatchMode=yes -P "$CPANEL_SSH_PORT" \
  "$archive_path" "${target}:${remote_archive}"

ssh -o BatchMode=yes -p "$CPANEL_SSH_PORT" "$target" "
  set -eu
  if [ -e '$current_directory' ] && [ ! -d '$current_directory' ] && [ ! -L '$current_directory' ]; then
    echo 'The cPanel current path must be a directory or symbolic link.' >&2
    exit 1
  fi
  if [ ! -f '$release_directory/.portfolio-release-complete' ]; then
    rm -rf '$release_directory'
    mkdir -p '$release_directory'
    tar -xzf '$remote_archive' -C '$release_directory'
    touch '$release_directory/.portfolio-release-complete'
  fi
  rm -f '$remote_archive'

  rm -rf '$candidate_directory'
  mkdir -p '$candidate_directory'
  cp -a '$release_directory/.' '$candidate_directory/'

  rm -rf '$previous_directory'
  if [ -L '$current_directory' ]; then
    rm -f '$current_directory'
  elif [ -d '$current_directory' ]; then
    mv '$current_directory' '$previous_directory'
  fi

  if ! mv '$candidate_directory' '$current_directory'; then
    if [ -d '$previous_directory' ] && [ ! -e '$current_directory' ]; then
      mv '$previous_directory' '$current_directory'
    fi
    exit 1
  fi
"

echo "Activated portfolio release ${GITHUB_SHA} at ${current_directory}"
