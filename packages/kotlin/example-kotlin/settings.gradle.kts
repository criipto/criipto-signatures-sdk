rootProject.name = "example-kotlin"

includeBuild("..") {
    dependencySubstitution {
        substitute(module("eu.idura:signatures")).using(project(":"))
    }
}
