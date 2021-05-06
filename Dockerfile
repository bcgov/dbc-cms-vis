FROM alpine:edge
MAINTAINER leo.lou@gov.bc.ca

ARG plugins=http.cors,http.git,http.realip
ARG http_port=5000

RUN apk update \
    && apk --no-cache add git openssh-client \
    && apk --no-cache add --virtual devs tar curl

#Install Caddy Server, and All Middleware
RUN curl -L "https://github.com/caddyserver/caddy/releases/download/v0.10.10/caddy_v0.10.10_linux_amd64.tar.gz" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy \
 && chmod 0755 /usr/bin/caddy \
 && /usr/bin/caddy -version


#create a default Caddyfile
RUN printf "0.0.0.0:$http_port\nroot /app\nlog stdout\nerrors stdout\next .html .htm" > /etc/Caddyfile
RUN mkdir -p /app  
WORKDIR /app
ADD . /app
RUN rm /app/*md /app/*file

RUN adduser -S app
RUN chown -R app:0 /app && chmod -R 770 /app
RUN apk del --purge devs  

USER app
EXPOSE $http_port
CMD ["caddy", "-quic", "--conf", "/etc/Caddyfile"]
