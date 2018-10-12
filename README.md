# Server for the RECOIN-Experiment

## Running a local development server

    npm install
    npm start

and then open "http://localhost:3000/" in your browser

Note: The mturk/ and api/ modules need a running **mongodb**.

## Deployment

local docker images:

    docker build -t recoin .
    docker run -p 3000:3000 recoin

docker images for deployment:

    docker build -t git.imp.fu-berlin.de:5000/jbenjamin/ikon/recoin-experiment .
    docker push git.imp.fu-berlin.de:5000/jbenjamin/ikon/recoin-experiment
    
running on the server

    docker run -p 8080:3000 -e AWS_ACCESS_KEY_ID=<insert here> -e AWS_SECRET_ACCESS_KEY=<insert here> -t git.imp.fu-berlin.de:5000/jbenjamin/ikon/recoin-experiment
   
 