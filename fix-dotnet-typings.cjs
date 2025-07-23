const fs = require('fs');
const typesSupressions = [
  'CS8601',
  'CS8603',
  'CS8604',
  'CS8618',
  'CS8619',
  'CS0111',
  'CA1507',
  'CA1715',
  'CA1724',
  'CA1062',
  'CA2227',
  'CA1724',
  'CA1002',
  'CA1034',
  'CA1056',
  'CA1707',
  'CA1720',
  'CA1052',
  'CA1819',
  'CA1716'
]

const operationsSupressions = [
  'CS8625',
  'CA1052',
  'CA2211'
];

const dotnetDirName = `${__dirname}/packages/dotnet`

let types = fs.readFileSync(dotnetDirName + '/Criipto.Signatures/Models.cs').toString();

let compositionTypes = [...types.matchAll(/public interface (.+) \{/g)].map(result => result[1]);

for (const compositionType of compositionTypes) {
  const listRegex = new RegExp(`^(.*?)List<${compositionType}>(.*?)$`, 'gm');
  types = types.replace(listRegex, function (match) {
    var indent = match.match(/^\s+/);
    return indent[0] + '[JsonConverter(typeof(CompositionTypeListConverter))]\n' + match;
  });

  const typeRegex = new RegExp(`^(.*?)(public|private|protected) ${compositionType} (.*?)$`, 'gm');
  types = types.replace(typeRegex, function (match) {
    if (match.includes('class') || match.includes('interface')) return match;
    var indent = match.match(/^\s+/);
    return (indent ? indent[0] : '') + '[JsonConverter(typeof(CompositionTypeConverter))]\n' + match;
  });
}

let enumTypes = [...types.matchAll(/public enum (.+) \{/g)].map(result => result[1]);
for (const enumType of enumTypes) {
  const typeRegex = new RegExp(`^(.*?)(public|private|protected) enum ${enumType} {((.|\n)*?)}$`, 'gm');
  const [match] = Array.from(types.match(typeRegex));
  const lines = match.split('\n');
  var indent = lines[lines.length - 2].match(/^\s+/);
  lines[lines.length - 2] = lines[lines.length - 2] + ',';
  lines.splice(lines.length - 1, undefined, indent + 'FUTURE_ADDED_VALUE = 999');
  types = types.replace(match, lines.join('\n'));

  const converterRegex = new RegExp(`^(.*?)(public|private|protected) ${enumType}(.*?)$`, 'gm');
  types = types.replace(converterRegex, function (match) {
    if (match.includes('class') || match.includes('interface') || match.includes('enum')) return match;
    var indent = match.match(/^\s+/);
    return (indent ? indent[0] : '') + '[JsonConverter(typeof(TolerantEnumConverter))]\n' + match;
  });
}

types = types.replace('namespace Criipto.Signatures {', 'namespace Criipto.Signatures.Models {');
types = types.replace('public class Types {', '');
types = types.replace(/}(?:\s+)}(?:\s+)$/, '}');

types = types.replace('[JsonProperty("startCriiptoVerifyEvidenceProvider")]', '');
types = types.replace('public StartCriiptoVerifyEvidenceProviderOutput startCriiptoVerifyEvidenceProvider { get; set; }', '');

types = typesSupressions.map(s => `#pragma warning disable ${s}`).join('\n') + '\n' + types;
fs.writeFileSync(dotnetDirName + '/Criipto.Signatures/Models.cs', types);

let operations = fs.readFileSync(dotnetDirName + '/Criipto.Signatures/Operations.cs').toString();
operations = operationsSupressions.map(s => `#pragma warning disable ${s}`).join('\n') + '\n' + operations;
fs.writeFileSync(dotnetDirName + '/Criipto.Signatures/Operations.cs', operations);