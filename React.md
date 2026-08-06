# Deploy React Application on Nginx
- Nginx Docker File
```
nginx/Dockerfile
```
## Deploying React App Required Node js to be installed in Linux
- This Can be done using two ways
- 1. Installing Node.js mannually in Environment and Adding a Stagging in Jenkins File
- 2. Using Docker Image directly from Docker
## Step:1 Installing Node js and Adding Stage in Jenkins File
__Step:1__ install node js in your System:
```
curl -fsSL https://rpm.nodesource.com/setup_current.x | sudo bash -

sudo dnf install -y nodejs
```
## Docker file
```
FROM nginx:alpine

# Remove default website
RUN rm -rf /usr/share/nginx/html/*

# Copy React build
COPY dist/ /usr/share/nginx/html/

# Optional custom nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```
## Add React Build Stage in Pipeline
```
stage('Build React') {
    steps {
        dir('ReactApp') {
            sh '''
                npm install
                npm run build
                ls -la
                ls -la dist
            '''
        }
    }
}
```
## Step:2 Using Docker Image
__Step:2__ Using Docker Image
- Dockefile for React
- ReactApp/Dockerfile
```
# Stage 1: Build React Application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build React application
RUN npm run build


# Stage 2: Nginx
FROM nginx:alpine

# Remove default website
RUN rm -rf /usr/share/nginx/html/*

# Copy React build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional custom nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```
## Docker Compose
```
version: "3.8"

services:
  mysql:
    image: mysql:8.4
    container_name: mysql_container
    restart: always

    environment:
      MYSQL_ROOT_PASSWORD: Neueda@123
      MYSQL_DATABASE: company

    ports:
      - "3306:3306"

    volumes:
      - mysql-data:/var/lib/mysql

    networks:
      - springboot-network

  springboot-app:
    build: .
    container_name: springboot_container

    depends_on:
      - mysql

    environment:
      SPRING_PROFILES_ACTIVE: docker
      DB_URL: jdbc:mysql://mysql:3306/company
      DB_USER: root
      DB_PASS: Neueda@123

    ports:
      - "8082:8082"

    networks:
      - springboot-network
  nginx:
    build:
      context: ./ReactApp
      dockerfile: Dockerfile
    container_name: nginx-server
    ports:
      - "8085:80"
    depends_on:
      - springboot-app
    networks:
      - springboot-network
volumes:
  mysql-data:

networks:
  springboot-network:
```