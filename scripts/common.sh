#!/usr/bin/env bash

export COLOR_OFF='\033[0m'
export COLOR_DIM='\033[2m'
export COLOR_RED='\033[31m'
export COLOR_GREEN='\033[32m'
export COLOR_BLUE='\033[34m'
export COLOR_MAGENTA='\033[35m'

die() {
  echo -e "$COLOR_RED"
  echo "!!!!"
  echo "!!!! $*" 1>&2
  echo -e "!!!!$COLOR_OFF"
  exit 1
}

header() {
  echo -e "$COLOR_DIM"
  echo "##"
  echo "## $*"
  echo -e "##$COLOR_OFF"
  echo
}

info() {
  echo
  echo -e "$COLOR_DIM## $*$COLOR_OFF"
  echo
}

success() {
  echo -e "$COLOR_GREEN## $*$COLOR_OFF"
}
