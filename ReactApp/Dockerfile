FROM nginx:alpine

#COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY dist/ /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]