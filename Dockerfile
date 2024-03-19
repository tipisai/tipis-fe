# build runner images
FROM nginx:stable-alpine as runner
RUN ls -alh /etc/nginx/

RUN apk add --no-cache \
    bash \
    sed


## copy frontend

COPY nginx.conf /etc/nginx/nginx.conf
COPY tipisai-frontend.conf /etc/nginx/conf.d/tipisai-frontend.conf
COPY ./apps/agent/dist /opt/tipisai/tipisai-frontend
RUN rm /etc/nginx/conf.d/default.conf

# test nginx
RUN nginx -t



RUN ls -alh /opt/tipisai/tipisai-frontend/


# run
EXPOSE 80