plugins {
    java
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("eu.idura:signatures:1.0.0")
    implementation("io.javalin:javalin:6.4.0")
    implementation("org.slf4j:slf4j-simple:2.0.17")
}

application {
    mainClass.set("eu.idura.example.Application")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}
