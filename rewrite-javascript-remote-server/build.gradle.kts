import com.hierynomus.gradle.license.tasks.LicenseCheck

plugins {
    id("org.openrewrite.build.language-library")
}


val latest = if (project.hasProperty("releasing")) "latest.release" else "latest.integration"
dependencies {

    implementation(project(":rewrite-javascript"))
    implementation(project(":rewrite-javascript-remote"))
    implementation(platform("org.openrewrite:rewrite-bom:$latest"))
    implementation("org.openrewrite:rewrite-java")
    implementation("org.openrewrite:rewrite-remote:$latest") {
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

tasks.clean {
    delete(projectDir.resolve("src/main/resources/package-lock.json"))
    delete(projectDir.resolve("src/main/resources/node_modules"))
}

tasks.compileJava {
    options.release = 8
}

tasks.withType<LicenseCheck> {
    include("*.java")
}


tasks.withType<Javadoc> {
    options {
        this as CoreJavadocOptions
        addStringOption("Xdoclint:none", "-quiet")
    }
}
