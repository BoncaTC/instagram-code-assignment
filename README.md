## Build and Run

    Installing Yarn using the following commands:
    In terminal type: npm install --global yarn
    Installing all the dependencies of project: yarn install
    To run the project: yarn dev

## Running the tests

    yarn test

## Rate limiting

    Aceesing the instagram api for a few times will get you limtated.

    Solution:
    Using the instagram sessionId of an user already logged in instagram
    axios.get(https://www.instagram.com/simonahalep/channel?__a=1, { headers: {session_id=user's sessionid}});

## Retreive data from API

    To retreive data and access api's endpoint example via curl:
        curl -XGET 'https://www.instagram.com/simonahalep/channel?__a=1&session_id=1816607895%3AuD4uLGzQCUeSai%3A9'
