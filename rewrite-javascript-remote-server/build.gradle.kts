import com.hierynomus.gradle.license.tasks.LicenseCheck

plugins {
    id("org.openrewrite.build.language-library")
}

tasks.compileJava {
    options.release = 8
}

tasks.withType<LicenseCheck> {
    include("*.java")
}

// We don't care about publishing javadocs anywhere, so don't waste time building them
tasks.withType<Javadoc>().configureEach {
    enabled = false
}

tasks.named<Jar>("sourcesJar") {
    enabled = false
}

tasks.named<Jar>("javadocJar") {
    enabled = false
}

val emptySourceJar = tasks.create<Jar>("emptySourceJar") {
    file("README.md")
    archiveClassifier.set("sources")
}

val emptyJavadocJar = tasks.create<Jar>("emptyJavadocJar") {
    file("README.md")
    archiveClassifier.set("javadoc")
}
