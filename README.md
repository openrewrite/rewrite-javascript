<p align="center">
  <a href="https://docs.openrewrite.org/">
      <img src="https://github.com/openrewrite/rewrite/raw/main/doc/logo-oss.png" alt="OpenRewrite">
    </a>
</p>

<div align="center">
  <h1>rewrite-javascript</h1>
</div>

<div align="center">

<!-- Keep the gap above this line, otherwise they won't render correctly! -->
[![ci](https://github.com/openrewrite/rewrite-javascript/actions/workflows/ci.yml/badge.svg)](https://github.com/openrewrite/rewrite-javascript/actions/workflows/ci.yml)
[![Maven Central](https://img.shields.io/maven-central/v/org.openrewrite/rewrite-javascript.svg)](https://mvnrepository.com/artifact/org.openrewrite/rewrite-javascript)
[![Revved up by Gradle Enterprise](https://img.shields.io/badge/Revved%20up%20by-Gradle%20Enterprise-06A0CE?logo=Gradle&labelColor=02303A)](https://ge.openrewrite.org/scans)
</div>

## Introduction

This project contains a series of Rewrite recipes and visitors to automatically apply best practices in JavaScript and TypeScript applications.

**Note**: For now, these languages and the associated recipes are only supported via the [Moderne CLI](https://docs.moderne.io/user-documentation/moderne-cli/getting-started/cli-intro) or the [Moderne Platform](https://docs.moderne.io/user-documentation/moderne-platform/getting-started/running-your-first-recipe) (at least until native build tool support catches up). That being said, the Moderne CLI is free to use for open-source repositories. If your repository is closed-source, though, you will need to obtain a license to use the CLI or the Moderne Platform. [Please contact Moderne to learn more](https://www.moderne.ai/contact-us).

## Getting started

For help getting started with the Moderne CLI, check out our [getting started guide](https://docs.moderne.io/user-documentation/moderne-cli/getting-started/cli-intro). Or, if you'd like to try running these recipes in the Moderne Platform, check out the [Moderne Platform quickstart guide](https://docs.moderne.io/user-documentation/moderne-platform/getting-started/running-your-first-recipe).

## Contributing

We appreciate all types of contributions. See the [contributing guide](https://github.com/openrewrite/.github/blob/main/CONTRIBUTING.md) for detailed instructions on how to get started.

## Development instructions

The release process is done by pushing a Git tag in the format of: `vX.Y.Z`. We use [Semantic versioning](https://semver.org/) for our releases. Below is example of how this is done:

```bash
git tag v1.0.0
git push origin v1.0.0
```

After pushing the tag, the CI/CD pipeline will automatically build and publish the package to the npm registry and bump the version in the package.json and package-lock.
