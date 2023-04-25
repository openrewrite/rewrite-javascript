plugins {
    id("org.openrewrite.build.recipe-library") version "latest.release"
}
group = "org.openrewrite"
description = "Rewrite Javascript"

val latest = rewriteRecipe.rewriteVersion.get()
dependencies {
    compileOnly("org.openrewrite:rewrite-test")

    implementation(platform("org.openrewrite:rewrite-bom:$latest"))
    implementation("org.openrewrite:rewrite-java")

    testImplementation("org.assertj:assertj-core:latest.release")
    testImplementation("org.junit.jupiter:junit-jupiter-api:latest.release")
    testImplementation("org.junit.jupiter:junit-jupiter-params:latest.release")
    testImplementation("org.openrewrite:rewrite-test")

    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:latest.release")

    implementation("com.caoccao.javet:javet-macos:2.1.1") // Mac OS (x86_64 and arm64)
}

tasks.withType<Javadoc> {
    options {
        this as CoreJavadocOptions
        addStringOption("Xdoclint:none", "-quiet")
    }
}

// TODO add index.js artifact from the js subproject