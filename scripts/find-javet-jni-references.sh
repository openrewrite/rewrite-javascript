#!/usr/bin/env bash

SCRIPT_DIR=$(realpath "$(dirname "${BASH_SOURCE[0]}")")
REWRITE_JS_DIR="$(dirname "$SCRIPT_DIR")"
JAVET_CHECKOUT_DIR="$SCRIPT_DIR/javet"
JAVET_REPO="git@github.com:caoccao/Javet.git"
OUTPUT_PATH="$REWRITE_JS_DIR/src/main/resources/javet-jni-classnames.txt"

source "$SCRIPT_DIR/common.sh"

header "Making sure Javet checkout exists and is up-to-date..."

if [ -d "$JAVET_CHECKOUT_DIR" ]; then
  cd "$JAVET_CHECKOUT_DIR" || die "Could not cd to $JAVET_CHECKOUT_DIR"
  info "Reusing existing Javet checkout."
  if [ ! -z "$(git status --porcelain)" ]; then
    die "Javet git checkout is not clean: $JAVET_CHECKOUT_DIR"
  fi
  git fetch
else
  cd "$SCRIPT_DIR" || die "Could not cd to $SCRIPT_DIR"
  info "Cloning a fresh Javet checkout."
  git clone "$JAVET_REPO" "$JAVET_CHECKOUT_DIR" || die "Could not clone Javet git repo"
  cd "$JAVET_CHECKOUT_DIR" || die "Could not cd to $JAVET_CHECKOUT_DIR"
fi

header "Checking which Javet version is being used by rewrite-javascript..."

cd "$REWRITE_JS_DIR" || die "Could not cd to $REWRITE_JS_DIR"
REWRITE_JS_DIR="$(dirname "$SCRIPT_DIR")"
JAVET_VERSIONS="$(
  ./gradlew -q dependencyInsight --dependency com.caoccao.javet:javet-macos \
    | grep -o "com.caoccao.javet:javet-macos:[0-9.]\+" \
    | sort \
    | uniq
)"
info "Versions found: $(echo "$JAVET_VERSIONS" | tr "\n" " ")"
JAVET_VERSION_COUNT=$(echo "$JAVET_VERSIONS" | wc -l | tr -d ' ')
if [ "$JAVET_VERSION_COUNT" -ne 1 ]; then
  die "Expected to find a single Javet version, but found $JAVET_VERSION_COUNT"
fi
JAVET_VERSION="$(echo "$JAVET_VERSIONS" | grep -o '[^:]\+$')"
if [ -z "$JAVET_VERSION" ]; then
  die "Could not find a valid Javet version in the gradle output"
fi

header "Checking out Javet version $JAVET_VERSION..."

cd "$JAVET_CHECKOUT_DIR" || die "Couldn't cd to $JAVET_CHECKOUT_DIR"
if [ -z "$(git tag -l "$JAVET_VERSION")" ]; then
  die "Couldn't find a $JAVET_VERSION tag in the Javet repo"
fi
git -c advice.detachedHead=false checkout "tags/$JAVET_VERSION"

header "Scanning Javet source for \`FIND_CLASS\` and \`FindClass\` references..."

JNI_CLASS_NAMES="$(grep -RE '(FindClass)|(FIND_CLASS)' | grep -o '".*"' | tr -d '"' | tr "/" "." | sort | uniq)"
JNI_CLASS_NAMES_COUNT="$(echo "$JNI_CLASS_NAMES" | wc -l | tr -d ' ')"

header "Writing $JNI_CLASS_NAMES_COUNT class names to $OUTPUT_PATH..."

echo "$JNI_CLASS_NAMES" > "$OUTPUT_PATH"

success "Done."