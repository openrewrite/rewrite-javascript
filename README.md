![Logo](https://github.com/openrewrite/rewrite/raw/main/doc/logo-oss.png)
### Eliminate legacy JavaScript & TypeScript patterns. Automatically.

[![ci](https://github.com/openrewrite/rewrite-javascript/actions/workflows/ci.yml/badge.svg)](https://github.com/openrewrite/rewrite-javascript/actions/workflows/ci.yml)
[![Apache 2.0](https://img.shields.io/github/license/openrewrite/rewrite-javascript.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Maven Central](https://img.shields.io/maven-central/v/org.openrewrite/rewrite-javascript.svg)](https://mvnrepository.com/artifact/org.openrewrite/rewrite-javascript)
[![Revved up by Gradle Enterprise](https://img.shields.io/badge/Revved%20up%20by-Gradle%20Enterprise-06A0CE?logo=Gradle&labelColor=02303A)](https://ge.openrewrite.org/scans)

## What is this?

This project contains a series of Rewrite recipes and visitors to automatically apply best practices in JavaScript and TypeScript applications.

## How to use?

See the full documentation at [docs.openrewrite.org](https://docs.openrewrite.org/).

## Contributing

We appreciate all types of contributions. See the [contributing guide](https://github.com/openrewrite/.github/blob/main/CONTRIBUTING.md) for detailed instructions on how to get started.


## Making release

The release process is done by pushing a Git tag in a format `vX.Y.Z` where XYZ stands for version number we release
and is picked up by Openrewrite Release Plugin.
It is important to a manual bump version in `openrewrite/package.json` after the release since we don't have any plugins
for NPM, which takes a version from the Git tag
