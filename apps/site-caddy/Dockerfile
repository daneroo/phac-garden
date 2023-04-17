# Use the official Caddy image as the base image
# Pin the minor version
FROM caddy:2.6-alpine

# Copy the Caddyfile into the container
COPY Caddyfile /etc/caddy/Caddyfile

# Copy the static HTML files into the container
COPY public /usr/share/caddy

# Expose port 8080 for Caddy
EXPOSE 8080
