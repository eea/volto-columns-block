# syntax=docker/dockerfile:1
ARG VOLTO_VERSION
FROM eeacms/frontend-builder:${VOLTO_VERSION}

ARG ADDON_NAME
ARG ADDON_PATH

COPY --chown=node:node ./ /app/src/addons/${ADDON_PATH}/

RUN /setupAddon
RUN yarn install

ENTRYPOINT ["yarn"]
CMD ["start"]
