# Use a nginx Docker image
# Pin the minor version
FROM nginx:1.23-alpine

# Embed the nginx configuration content directly in the Dockerfile
RUN echo -e "server {\n\
    listen 8080;\n\
    server_name localhost;\n\
    location / {\n\
        root   /usr/share/nginx/html;\n\
        index  index.html index.htm;\n\
    }\n\
}" > /etc/nginx/conf.d/default.conf

# Copy the static HTMLs to the nginx directory
COPY public /usr/share/nginx/html

# Expose port 8080 for NGINX
EXPOSE 8080

# Substitute the environment variables and generate the final config
CMD exec nginx -g 'daemon off;'
