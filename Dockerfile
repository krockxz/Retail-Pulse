# Use official Node.js image as base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code into the container
COPY . .

# Expose the app's port
EXPOSE 3000

# Command to run the app
CMD [ "node", "app.js" ]
