#should match the playwright version in package.json
FROM mcr.microsoft.com/playwright:v1.57.0-noble

#Set up application directory
RUN mkdir /app

#Set working directory
WORKDIR /app

#Copy application files to working directory
COPY . /app/

#Install npm dependencies
RUN npm install --force

#Install Playwright browsers
RUN npx playwright install



