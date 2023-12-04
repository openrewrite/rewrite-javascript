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

    compileOnly("org.assertj:assertj-core:latest.release")
    testImplementation("org.assertj:assertj-core:latest.release")
    testImplementation("org.junit.jupiter:junit-jupiter-api:latest.release")
    testImplementation("org.junit.jupiter:junit-jupiter-params:latest.release")
    testImplementation("org.openrewrite:rewrite-test")
    testImplementation("org.openrewrite.recipe:rewrite-static-analysis:${latest}")
    testImplementation("org.junit-pioneer:junit-pioneer:2.0.0")

    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:latest.release")

    implementation("com.caoccao.javet:javet-macos:latest.release") // Mac OS (x86_64 and arm64)
    implementation("com.caoccao.javet:javet:latest.release") // Linux and Windows
}

tasks.withType<Javadoc> {
    options {
        this as CoreJavadocOptions
        addStringOption("Xdoclint:none", "-quiet")
    }
}

// TODO add index.js artifact from the js subproject
