plugins {
    id("com.github.node-gradle.node") version "3.5.1"
}

apply(plugin = "base")
apply(plugin = "com.github.node-gradle.node")

group = "org.openrewrite"

node {
    version.set("18.15.0")
    npmVersion.set("9.5.0")
    download.set(true)
}

tasks.getByName("yarn_install") {
    inputs.file("package.json")
    outputs.file("yarn.lock")
    outputs.dir("node_modules")
}

tasks.getByName<Delete>("clean") {
    delete.add("node_modules")
    delete.add("dist")
}

tasks.getByName("yarn_build") {
    inputs.file("tsconfig.json")
    inputs.file("package.json")
    inputs.file("yarn.lock")
    inputs.dir("src")
    outputs.dir("dist")
}

// TODO add artifact for index.js
