# Pin the patch version
# deno images are not tagged with minors: no deno:alipine-1.31
FROM denoland/deno:alpine-1.31.1

WORKDIR /app

ADD . /app

# This version only invokes deno cache
# i.e. Cache and compile remote dependencies recursively.
RUN deno cache server.ts

EXPOSE 8080

# this command inherits the entrypoint from the base image
CMD ["run", "--allow-net", "server.ts"]
