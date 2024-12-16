plugins {
    id("org.openrewrite.build.language-library")
    application
}

application {
    mainClass = "org.openrewrite.remote.java.RemotingServer"
}

val latest = if (project.hasProperty("nebula.release")) "latest.release" else "latest.integration"

dependencies {

    // The bom version can also be set to a specific version
    // https://github.com/openrewrite/rewrite-recipe-bom/releases
    implementation(platform("org.openrewrite:rewrite-bom:latest.release"))

    implementation("org.openrewrite:rewrite-core")
    implementation("org.openrewrite:rewrite-java")

    implementation(project(":rewrite-javascript"))
    implementation(project(":rewrite-javascript-remote"))

    implementation("org.openrewrite:rewrite-remote:${latest}") {
        exclude(group = "org.openrewrite", module = "rewrite-remote-java")
    }
    implementation("org.openrewrite:rewrite-remote-java:${latest}") {
        exclude(group = "org.openrewrite", module = "rewrite-remote-java")
    }

    implementation("io.micrometer:micrometer-core:latest.release")
    implementation("com.fasterxml.jackson.core:jackson-core")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-cbor")

    // Need to have a slf4j binding to see any output enabled from the parser.
    runtimeOnly("ch.qos.logback:logback-classic:1.2.+")
    testImplementation("org.openrewrite:rewrite-test")

    testRuntimeOnly("org.openrewrite:rewrite-java-17")
}


// We don't care about publishing javadocs anywhere, so don't waste time building them
tasks.withType<Javadoc>().configureEach {
    enabled = false
}

tasks.register<Jar>("fatJar") {
    manifest {
        attributes(
            "Main-Class" to "org.openrewrite.remote.java.RemotingServer"
        )
    }
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
    dependsOn(configurations.runtimeClasspath)
    archiveFileName = "${project.name}-fat-jar.jar"
}

tasks.named("startScripts").configure {
    dependsOn(":rewrite-test-engine-remote:fatJar")
}

tasks.named<Jar>("sourcesJar") {
    enabled = false
}

tasks.named<Jar>("javadocJar") {
    enabled = false
}


tasks.withType<PublishToMavenRepository>().configureEach { enabled = false }
tasks.withType<PublishToMavenLocal>().configureEach { enabled = false }

val emptySourceJar = tasks.create<Jar>("emptySourceJar") {
    file("README.md")
    archiveClassifier.set("sources")
}

val emptyJavadocJar = tasks.create<Jar>("emptyJavadocJar") {
    file("README.md")
    archiveClassifier.set("javadoc")
}
