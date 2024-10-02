import com.hierynomus.gradle.license.tasks.LicenseCheck

plugins {
    id("org.openrewrite.build.recipe-library") version "latest.release"
}
group = "org.openrewrite"
description = "Rewrite JavaScript"

val latest = rewriteRecipe.rewriteVersion.get()
dependencies {
    compileOnly("org.openrewrite:rewrite-test")

    implementation(platform("org.openrewrite:rewrite-bom:$latest"))
    implementation("org.openrewrite:rewrite-java")
    implementation("org.openrewrite:rewrite-remote-java:latest.integration") {
        exclude(group = "org.openrewrite", module = "rewrite-javascript")
    }

    compileOnly("org.assertj:assertj-core:latest.release")
    testImplementation("org.assertj:assertj-core:latest.release")
    testImplementation("org.junit.jupiter:junit-jupiter-api:latest.release")
    testImplementation("org.junit.jupiter:junit-jupiter-params:latest.release")
    testImplementation("org.openrewrite:rewrite-test")
    testImplementation("org.openrewrite.recipe:rewrite-static-analysis:${latest}")
    testImplementation("org.junit-pioneer:junit-pioneer:2.0.0")

    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:latest.release")
}

// FIXME disable all tests for now until the parser tests have been moved to JavaScript
tasks.withType<Test> {
    enabled = false
}

tasks.withType<Javadoc> {
    options {
        this as CoreJavadocOptions
        addStringOption("Xdoclint:none", "-quiet")
    }
}

tasks.withType<LicenseCheck> {
    include("*.java")
}

// TODO add index.js artifact from the js subproject
