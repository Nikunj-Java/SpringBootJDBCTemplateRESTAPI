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