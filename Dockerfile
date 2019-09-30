FROM node:12.10.0

COPY . /app/

RUN cd /app/ &&
    npm install

WORKDIR /app
ENTRYPOINT [ "node", "index.js" ]
