# Docker Image for running code generation
#
# Usage (from repo root): pnpm run codegen:in-docker

# All toolchains and dependencies are pinned in this image; the only inputs
# from the host are the package directories that codegen writes into.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS base

ARG NODE_MAJOR=22
ARG RUST_VERSION=1.85.0
ARG UV_VERSION=0.5.11

ENV DEBIAN_FRONTEND=noninteractive \
    RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:/root/.dotnet/tools:/usr/local/bin:$PATH

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates gnupg git \
 && curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
 && apt-get install -y --no-install-recommends nodejs

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
    | sh -s -- -y --default-toolchain ${RUST_VERSION} --profile minimal --component rustfmt \
 && chmod -R a+rwX /usr/local/cargo /usr/local/rustup

RUN curl -LsSf https://astral.sh/uv/${UV_VERSION}/install.sh | sh \
 && cp /root/.local/bin/uv /root/.local/bin/uvx /usr/local/bin/

WORKDIR /workspace

# Install npm deps first so they are cached independently of source changes.
COPY package.json package-lock.json ./
COPY codegen/graphql-codegen-plugin-python/package.json codegen/graphql-codegen-plugin-python/package-lock.json codegen/graphql-codegen-plugin-python/
COPY codegen/graphql-codegen-plugin-rust/package.json codegen/graphql-codegen-plugin-rust/package-lock.json codegen/graphql-codegen-plugin-rust/
COPY codegen/graphql-codegen-shared/package.json codegen/graphql-codegen-shared/package-lock.json codegen/graphql-codegen-shared/
RUN npm ci

# Restore the dotnet csharpier tool pinned in .config/dotnet-tools.json.
COPY .config ./.config
RUN dotnet tool restore

# Pre-fetch ruff via uvx so codegen runs offline-friendly after build.
RUN uvx ruff --version

# Bake the rest of the repo into the image. Output directories under
# packages/ are expected to be overlaid with a host bind mount at runtime.
COPY . .

ENTRYPOINT ["npm", "run", "codegen"]
