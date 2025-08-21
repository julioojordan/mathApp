FROM node:20
WORKDIR /app
RUN npm install -g yarn --force
COPY package.json yarn.lock ./
RUN yarn install --ignore-engines
RUN yarn global add serve
COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV


ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN yarn build

CMD if [ "$NODE_ENV" = "development" ]; \
    then yarn dev --host; \
    else serve -s dist -l 5000; \
    fi
