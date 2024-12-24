rootProject.name = "rewrite-javascript"
include("rewrite-javascript")
include("rewrite-javascript-remote")
include("rewrite-test-engine-remote")
include("rewrite-javascript-remote-server")

// ---------------------------------------------------------------
// ------ Gradle Develocity Configuration ------------------------
// ---------------------------------------------------------------

plugins {
    id("com.gradle.develocity") version "latest.release"
    id("com.gradle.common-custom-user-data-gradle-plugin") version "latest.release"
}

develocity {
    val isCiServer = System.getenv("CI")?.equals("true") ?: false
    server = "https://ge.openrewrite.org/"
    val accessKey = System.getenv("GRADLE_ENTERPRISE_ACCESS_KEY")
    val authenticated = !accessKey.isNullOrBlank()
    buildCache {
        remote(develocity.buildCache) {
            isEnabled = true
            isPush = isCiServer && authenticated
        }
    }

    buildScan {
        capture {
            fileFingerprints = true
        }
        publishing {
            onlyIf {
                authenticated
            }
        }

        uploadInBackground = !isCiServer
    }
}
