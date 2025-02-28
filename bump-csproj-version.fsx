#r "nuget:FsToolkit.ErrorHandling"

open System
open System.Xml

open FsToolkit.ErrorHandling

let sdkCsprojPath = "packages/dotnet/Criipto.Signatures/Criipto.Signatures.csproj"
let versionNodePath = "/Project/PropertyGroup/Version"

let semVerStringRegexPattern = "^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"
let updateVersion (newVersion: string) =
    result {
        do! System.Text.RegularExpressions.Regex.IsMatch(newVersion, semVerStringRegexPattern)
            |> Result.requireTrue $"The new version '%s{newVersion}' does not match expected semver pattern - xx.xx.xx"

        let sdkCsprojXml = XmlDocument()
        try
            sdkCsprojPath |> sdkCsprojXml.Load
        with
        | :? IO.FileNotFoundException -> return! $"The `csproj` file does not reside at %s{sdkCsprojPath}" |> Error
        | exn -> return! $"Encountered unexpected error: %s{exn.Message}" |> Error

        let versionNode = versionNodePath |> sdkCsprojXml.SelectSingleNode
        versionNode.InnerText <- newVersion

        sdkCsprojPath |> sdkCsprojXml.Save
    }

let newVersion = Console.ReadLine()

let exitCode =
    match newVersion |> updateVersion with
    | Ok _ -> 0
    | Error e -> Console.WriteLine e; 99

exit exitCode
