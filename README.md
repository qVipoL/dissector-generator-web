## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.\
Can create a link to the static directory on the server for easier deployment.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## How to Deploy

- create a static directory on the server called 'dissector-generator-web' and move the files from the 'build' into it.

- create a static directory on the server called 'dissector-generator-api' and move the [https://github.com/qVipoL/dissector-generator-backend](dissector-generator-backend) into it.

- intall phpmyadmin on the server

- create two tables with the following scheme:

- enter in the browser to http(s):/[domain]/dissector-generator-web
