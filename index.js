const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");

inquirer
  .prompt([
    {
      type: "input",
      message: "What is you GitHub username?",
      name: "username"
    },
    {
      type: "list",
      message: "What is your favorite color?",
      name: "colors",
      choices: ["blue", "red", "green", "yellow"]
    }
  ])
  .then(function(response) {
    fs.writeFile("log.txt", response.colors, function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("Success!");
    });
  });
