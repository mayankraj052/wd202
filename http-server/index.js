const http = require("http");
const fs = require("fs");
const path = require("path");
const minimist = require("minimist"); // npm i minimist --save

// Parse command line arguments
// eslint-disable-next-line no-undef
const args = minimist(process.argv.slice(2), {
  default: {
    port: 5000,
  },
});

// Define file paths
// eslint-disable-next-line no-undef
const homePath = path.join(__dirname, "home.html");
// eslint-disable-next-line no-undef
const projectPath = path.join(__dirname, "project.html");
// eslint-disable-next-line no-undef
const registrationPath = path.join(__dirname, "registration.html");

// Read files asynchronously
const readFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Serve files
Promise.all([
  readFileAsync(homePath),
  readFileAsync(projectPath),
  readFileAsync(registrationPath),
])
  .then(([homeContent, projectContent, registerContent]) => {
    http
      .createServer((request, response) => {
        const url = request.url;
        response.writeHead(200, { "Content-Type": "text/html" });

        switch (url) {
          case "/project":
            response.write(projectContent);
            response.end();
            break;
          case "/registration":
            response.write(registerContent);
            response.end();
            break;
          default:
            response.write(homeContent);
            response.end();
            break;
        }
      })
      .listen(args.port, () => {
        console.log(`Server is running on port ${args.port}`);
      });
  })
  .catch((err) => {
    console.error("Error reading files:", err);
  });
