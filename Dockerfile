#  Dockerfile for Node Express Backend api (development)
FROM node:10.24.0-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Install Dependencies
COPY ./package*.json ./

RUN npm ci

# Copy app source code
COPY --chown=node:node ./src ./src
# Copy public folder
COPY --chown=node:node ./public ./public
# Copy public folder
COPY --chown=node:node ./views ./views

# If you also need fonts then add this - Select any fonts from here https://wiki.alpinelinux.org/wiki/Fonts
# Just replace ttf-ubuntu-font-family with fonts that you need
RUN apk --update add ttf-ubuntu-font-family fontconfig && rm -rf /var/cache/apk/*

# if ever you need to change phantom js version number in future ENV comes handy as it can be used as a dynamic variable
ENV PHANTOMJS_VERSION=2.1.1

# magic command
RUN apk add --no-cache curl && \
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${PHANTOMJS_VERSION}-linux-x86_64.tar.bz2 | tar -jxf - && \
    cp phantomjs-${PHANTOMJS_VERSION}-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
    rm -fR phantomjs-${PHANTOMJS_VERSION}-linux-x86_64 && \
    apk del curl

USER node

EXPOSE 5000

CMD ["npm","start"]
