#pragma warning disable CA1062
#pragma warning disable CA1854

using System.Collections;
using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Criipto.Signatures
{
    public static class Utils
    {
        private static readonly ConcurrentDictionary<
            string,
            Func<JToken, object>
        > ToObjectForTypenameCache = new();

        public static Func<JToken?, object>? GetToObjectMethodForTargetType(string typeName)
        {
            if (!ToObjectForTypenameCache.ContainsKey(typeName))
            {
                // Get the type corresponding to the typename
                Type? targetType = Assembly
                    .GetExecutingAssembly()
                    .GetTypes()
                    .ToList()
                    .Where(t => t.Name == typeName)
                    .FirstOrDefault();

                if (targetType == null)
                    return null;
                // Create a parametrised ToObject method using targetType as <TypeArgument>
                var method = typeof(JToken)
                    .GetMethods()
                    .Where(m =>
                        m.Name == "ToObject" && m.IsGenericMethod && m.GetParameters().Length == 0
                    )
                    .FirstOrDefault();

                if (method == null)
                    return null;
                var genericMethod = method.MakeGenericMethod(targetType);
                var toObject =
                    (Func<JToken, object>)
                        genericMethod.CreateDelegate(
                            Expression.GetFuncType(typeof(JToken), typeof(object))
                        );
                ToObjectForTypenameCache[typeName] = toObject;
            }
            return (Func<JToken?, object>)ToObjectForTypenameCache[typeName];
        }
    }

    /// <summary>
    /// Converts an instance of a composition type to the appropriate implementation of the interface
    /// </summary>
    public class CompositionTypeConverter : JsonConverter
    {
        /// <inheritdoc />
        public override object? ReadJson(
            JsonReader reader,
            Type objectType,
            object? existingValue,
            JsonSerializer serializer
        )
        {
            if (reader.TokenType == JsonToken.Null)
                return null;
            var loadedObject = JObject.Load(reader);
            if (loadedObject == null)
                return null;
            var typeNameObject = loadedObject["__typename"];
            if (typeNameObject == null)
            {
                throw new JsonSerializationException(
                    $"CompositionTypeConverter Exception: missing __typeName field when parsing {objectType.Name}. Requesting the __typename field is required for converting Composition Types"
                );
            }
            var typeName = loadedObject["__typename"]?.Value<string>();
            if (typeName == null)
                return null;
            var toObject = Utils.GetToObjectMethodForTargetType(typeName);
            if (toObject == null)
                return null;
            return toObject(loadedObject);
        }

        /// <inheritdoc />
        public override bool CanConvert(Type objectType)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc />
        public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
        {
            throw new NotImplementedException("Tried to write a GQL Composition type to JSON");
        }
    }

    /// <summary>
    /// Converts a list of instances of a composition type to the appropriate implementation of the interface
    /// </summary>
    public class CompositionTypeListConverter : JsonConverter
    {
        /// <inheritdoc />
        public override object? ReadJson(
            JsonReader reader,
            Type objectType,
            object? existingValue,
            JsonSerializer serializer
        )
        {
            if (reader.TokenType == JsonToken.Null)
                return null;
            var items = JArray.Load(reader).Children();
            var list = Activator.CreateInstance(objectType) as IList;
            if (list == null)
                return null;
            foreach (var item in items)
            {
                var typeNameObject = item["__typename"];
                if (typeNameObject == null)
                {
                    throw new JsonSerializationException(
                        $"CompositionTypeListConverter Exception: missing __typeName field when parsing {objectType.Name}. Requesting the __typename field is required for converting Composition Types"
                    );
                }
                var typeName = item["__typename"]?.Value<string>();
                if (typeName == null)
                    return null;
                var toObject = Utils.GetToObjectMethodForTargetType(typeName);
                if (toObject == null)
                    continue;
                object objectParsed = toObject(item);
                list.Add(objectParsed);
            }
            return list;
        }

        /// <inheritdoc />
        public override bool CanConvert(Type objectType)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc />
        public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
        {
            throw new NotImplementedException("Tried to write a GQL Composition type list to JSON");
        }
    }

    public class TolerantEnumConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            if (objectType == null)
                return false;
            Type? type = IsNullableType(objectType)
                ? Nullable.GetUnderlyingType(objectType)
                : objectType;
            if (type == null)
                return false;
            return type.IsEnum;
        }

        public override object? ReadJson(
            JsonReader reader,
            Type objectType,
            object? existingValue,
            JsonSerializer serializer
        )
        {
            bool isNullable = IsNullableType(objectType);
            Type? enumType = isNullable ? Nullable.GetUnderlyingType(objectType) : objectType;

            if (enumType == null)
                return null;

            string[] names = Enum.GetNames(enumType);
            string? defaultName = names
                .Where(n =>
                    string.Equals(n, "FUTURE_ADDED_VALUE", StringComparison.OrdinalIgnoreCase)
                )
                .FirstOrDefault();

            if (reader.TokenType == JsonToken.Null)
            {
                if (defaultName == null)
                    return null;
                return Enum.Parse(enumType, defaultName);
            }
            if (reader.TokenType == JsonToken.String)
            {
                string? enumText = reader.Value?.ToString();

                if (!string.IsNullOrEmpty(enumText))
                {
                    string? match = names
                        .Where(n => string.Equals(n, enumText, StringComparison.OrdinalIgnoreCase))
                        .FirstOrDefault();

                    if (match != null)
                    {
                        return Enum.Parse(enumType, match);
                    }

                    if (defaultName == null)
                        return null;

                    return Enum.Parse(enumType, defaultName);
                }
            }

            return null;
        }

        public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
        {
            if (value == null)
            {
                writer.WriteValue("null");
                return;
            }
            writer.WriteValue(value.ToString());
        }

        private static bool IsNullableType(Type t)
        {
            return (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(Nullable<>));
        }
    }
}
