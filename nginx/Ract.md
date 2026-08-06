# Deploy React Application on Nginx
- Nginx Docker File
```
nginx/Dockerfile
```
```
FROM nginx:alpine

# Remove default website
RUN rm -rf /usr/share/nginx/html/*

# Copy React build
COPY dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```