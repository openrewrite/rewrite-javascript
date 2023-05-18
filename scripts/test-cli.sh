#!/usr/bin/env bash

SCRIPT_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")")
REWRITE_JS_DIR="$(dirname "$SCRIPT_DIR")"
MODERNE_CLI_DIR="$(dirname "$REWRITE_JS_DIR")/moderne-cli"
EXAMPLE_DIR="$(realpath "$1")"

MODERNE_CLI="$MODERNE_CLI_DIR/build/native/nativeCompile/mod"

source "$SCRIPT_DIR/common.sh"

header "Running sanity checks..."

[ ! -d "$MODERNE_CLI_DIR" ] && die "Could not find moderne-cli project at $MODERNE_CLI_DIR"
[ ! -d "$EXAMPLE_DIR" ] && die "Could not find example project at $EXAMPLE_DIR"
[ -z "$GRAALVM_HOME" ] && die "No GRAALVM_HOME is set"

header "Building rewrite-javascript..."

cd "$REWRITE_JS_DIR" || die "Could not cd to $REWRITE_JS_DIR"
./gradlew pTML || die "Could not publish local artifact for rewrite-javascript"

header "Building moderne-cli native image..."

cd "$MODERNE_CLI_DIR" || die "Could not cd to $MODERNE_CLI_DIR"
JAVA_HOME="$GRAALVM_HOME" ./gradlew clean || die "Could not clean moderne-cli build"
JAVA_HOME="$GRAALVM_HOME" ./gradlew nativeCompile || die "Could not build native image of moderne-cli"

header "Running moderne-cli on an example project..."

cd "$EXAMPLE_DIR" || die "Could not cd to $EXAMPLE_DIR"
"$MODERNE_CLI" build --verbose --path . || die "Could not run moderne-cli on the example TS project"
