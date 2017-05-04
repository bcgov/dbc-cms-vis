FROM alpine:edge
MAINTAINER leo.lou@gov.bc.ca

RUN apk update \
    && apk --no-cache add git openssh-client \
    && apk --no-cache add --virtual devs tar curl

#Install Caddy Server, and All Middleware
RUN curl "https://caddyserver.com/download/build?os=linux&arch=amd64&features=DNS%2Cawslambda%2Ccors%2Cexpires%2Cfilemanager%2Cgit%2Chugo%2Cipfilter%2Cjsonp%2Cjwt%2Clocale%2Cmailout%2Cminify%2Cmultipass%2Cprometheus%2Cratelimit%2Crealip%2Csearch%2Cupload%2Ccloudflare%2Cdigitalocean%2Cdnsimple%2Cdyn%2Cgandi%2Cgooglecloud%2Clinode%2Cnamecheap%2Crfc2136%2Croute53%2Cvultr" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy


#Copy over a default Caddyfile
COPY ./Caddyfile /etc/Caddyfile


RUN mkdir -p /app
  
WORKDIR /app
ADD . /app

RUN adduser -S app
RUN chown -R app:0 /app && chmod -R 770 /app
RUN apk del --purge devs  

USER app
EXPOSE 5000

CMD ["caddy", "-quic", "--conf", "/etc/Caddyfile"]