# Use the official Caddy image as the base image
# Pin the minor version
FROM caddy:2.6-alpine

## Embed the Caddyfile content directly in the Dockerfile

# Thought the http scheme was required to prevent assuming https
#  i.e. http://localhost:8080 { ...}
# but bare port specification seems to turn off auto_https as well
# i.e. :8080 { ...}

RUN echo -e "# bare port specification seems to turn off auto_https\n\
:8080 {\n\
    root * /usr/share/caddy\n\
    file_server\n\
}" > /etc/caddy/Caddyfile

# Copy the static HTML files into the container
COPY public /usr/share/caddy

# Expose port 8080 for Caddy
EXPOSE 8080
