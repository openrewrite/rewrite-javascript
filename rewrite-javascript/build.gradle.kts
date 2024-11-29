import com.hierynomus.gradle.license.tasks.LicenseCheck

plugins {
    id("org.openrewrite.build.language-library")
}


//val latest = if (System.getenv("RELEASE_PUBLICATION") != null) "latest.release" else "latest.integration"
val latest = "latest.release";
dependencies {
    compileOnly("org.openrewrite:rewrite-test")

    implementation(platform("org.openrewrite:rewrite-bom:$latest"))
    implementation("org.openrewrite:rewrite-java")
    implementation("org.openrewrite:rewrite-remote-java:$latest") {
        exclude(group = "org.openrewrite", module = "rewrite-javascript")
    }

    compileOnly("org.assertj:assertj-core:latest.release")
    testImplementation("org.assertj:assertj-core:latest.release")
    testImplementation("org.junit.jupiter:junit-jupiter-api:latest.release")
    testImplementation("org.junit.jupiter:junit-jupiter-params:latest.release")
    testImplementation("org.openrewrite:rewrite-test")
    testImplementation("org.openrewrite.recipe:rewrite-static-analysis:${latest}")
    testImplementation("org.junit-pioneer:junit-pioneer:2.0.0")
    testImplementation(project(":rewrite-javascript-remote"))

    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:latest.release")
    testRuntimeOnly(project(":rewrite-javascript-remote"))
}

tasks.withType<LicenseCheck> {
    include("*.java")
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
