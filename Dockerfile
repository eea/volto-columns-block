# syntax=docker/dockerfile:1
# Add-on overlay onto eeacms/frontend-builder (Volto + Chromium base).
ARG VOLTO_VERSION
FROM eeacms/frontend-builder:${VOLTO_VERSION}

ARG ADDON_PATH

# Overlay the add-on onto the base; rm -rf /app/cypress so the add-on's EEA
# cypress replaces the base's upstream Volto one.
COPY --chown=node:node ./ /app/src/addons/${ADDON_PATH}/
RUN rm -rf /app/cypress \
    && cp -r /app/src/addons/${ADDON_PATH}/. /app/ \
    && pnpm install \
    && make build-deps