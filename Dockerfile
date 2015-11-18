FROM hypriot/rpi-node:4.1.2

# Adding source files into container
ADD src/ /src

# Define working directory
WORKDIR /src

# install gulp and bower
RUN npm install -g gulp bower

# Install app dependencies
RUN npm install && \
    bower install

# Generate stylesheet
RUN gulp less

# Run Node.js
CMD ["node", "server.js"]
