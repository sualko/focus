FROM node:12

RUN apt-get install -y curl
RUN curl https://install.meteor.com/ | /bin/sh
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY . /usr/app

WORKDIR /usr/app

RUN npm install

RUN mkdir /usr/dist/

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser && mkdir -p /home/pptruser/Downloads
RUN chown -R pptruser:pptruser /usr/dist/ && chown -R pptruser:pptruser /usr/app/ && chown -R pptruser:pptruser /home/pptruser

USER pptruser

RUN meteor build /usr/dist/ --directory --debug

WORKDIR /usr/dist/bundle/programs/server

RUN npm install

WORKDIR /usr/dist/bundle
