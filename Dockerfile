FROM node:8.11.3-alpine

ENV NODE_ROOT /opt/

RUN mkdir -p $NODE_ROOT
WORKDIR $NODE_ROOT

COPY app $NODE_ROOT/app
COPY config $NODE_ROOT/config
COPY app.js app-insights.js package.json security.js server.js yarn.lock $NODE_ROOT/

RUN rm -rf node_modules \
    && yarn install --no-progress --non-interactive --production --pure-lockfile \
    && yarn build \
    && yarn cache clean

HEALTHCHECK --interval=10s --timeout=10s --retries=12 CMD http_proxy="" wget -q -O- http://localhost:3000/health | grep '{"status":"UP".*}' || exit 1

EXPOSE 3000

CMD [ "yarn", "start", "--production" ]
