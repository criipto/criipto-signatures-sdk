plugins {
    kotlin("jvm") version "2.1.21"
    id("org.jlleitschuh.gradle.ktlint") version "12.3.0"
    id("com.vanniktech.maven.publish") version "0.35.0"
}

group = "eu.idura"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.18.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")

    testImplementation(kotlin("test"))
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.2")
}

tasks.test {
    useJUnitPlatform()
}

ktlint {
    filter {
        // Generated files do not follow ktlint naming conventions
        exclude("**/operations.kt", "**/builders.kt", "**/types.kt")
    }
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_11)
    }
}

mavenPublishing {
    publishToMavenCentral()
    signAllPublications()

    coordinates("eu.idura", "signatures", version.toString())

    pom {
        name = "Idura Signatures Kotlin"
        description = "A Kotlin SDK for the Idura Signatures API."
        inceptionYear = "2025"
        url = "https://github.com/criipto/criipto-signatures-sdk"
        licenses {
            license {
                name = "MIT"
                url = "https://mit-license.org/"
                distribution = "https://mit-license.org/"
            }
        }
        developers {
            developer {
                id = "janmeier"
                email = "jan.meier@idura.eu"
                name = "Jan Aagaard Meier"
                url = "https://github.com/janmeier"
                organization = "Idura"
                organizationUrl = "https://idura.eu"
            }
        }
        scm {
            url = "https://github.com/criipto/criipto-signatures-sdk"
            connection = "scm:git:git://github.com/criipto/criipto-signatures-sdk.git"
            developerConnection = "scm:git:ssh://git@github.com/criipto/criipto-signatures-sdk.git"
        }
    }
}
