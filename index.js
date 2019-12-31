const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
// const puppeteer = require("puppeteer");

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
  .then(function({ username, colors }) {
    const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    axios.get(queryUrl).then(function(res) {
      const repoNames = res.data.map(function(repo) {
        return repo.name;
      });

      //   const repoNamesStr = repoNames.join("\n");
      const repoNamesStr = `<p style="${colors};">Hello</p>`;

      fs.writeFile("repos.txt", repoNamesStr, function(err) {
        if (err) {
          throw err;
        }

        console.log(`Saved ${repoNames.length} repos`);
      });
    });
  });
