rootProject.name = "example-java"

includeBuild("..") {
    dependencySubstitution {
        substitute(module("eu.idura:signatures")).using(project(":"))
    }
}
