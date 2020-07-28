FROM nginx:latest

RUN useradd -u 3000 sendy

RUN mkdir -p mkdir -p /var/run/nginx /var/tmp/nginx \
    && chown -R sendy:sendy /usr/share/nginx/ /var/run/ /var/tmp/nginx /etc/nginx 
COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN apt-get update && \
    apt-get install -y sudo curl bzip2 wget git vim gnupg

RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

RUN sudo apt-get -y install build-essential

RUN sudo apt-get -y install nodejs

RUN sudo apt-get clean

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log


RUN mkdir /build && mkdir /app

WORKDIR /build

COPY . /build/

ARG DOCKER_ENV

ENV DOCKER_ENV=$DOCKER_ENV

RUN npm install && npm rebuild node-sass && npm run build

RUN cp nginx/default.conf /etc/nginx/conf.d/default.conf && \
    cp -R /build/dist/*  /app/ && \
    rm -fr /build

WORKDIR /app

USER sendy:sendy

CMD ["nginx", "-g", "daemon off;"]
