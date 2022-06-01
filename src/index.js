const express = require("express");
const app = express();
const cluster = require("cluster");
const os = require("os");

const numOfCpus = os.cpus().length;

//create a server object:
app.get("/", function (req, res) {
  res.write(`Hello World!... ${process.pid}`); //write a response to the client
  res.end(); //end the response
  cluster.worker.kill();
});

if (cluster.isMaster) {
  for (let i = 0; i < numOfCpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} is dead`);
    cluster.fork();
  });
} else {
  app.listen(8080, function () {
    console.log("server running on 8080");
  }); //the server object listens on port 8080
}
