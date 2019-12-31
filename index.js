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
    const queryUrl = `https://api.github.com/users/${username}`;
    axios.get(queryUrl).then(function(res) {
      console.log(res);
      console.log(res.data.location);
      console.log(res.data.html_url);
      console.log(res.data.blog);
      console.log(res.data.bio);
      console.log(res.data.public_repos);
      console.log(res.data.followers);
      console.log(res.data.following);
      console.log(res.data.public_gists);
      //   const repoNames = res.data.map(function(repo) {
      //     return repo.name;
      //   });

      //   const repoNamesStr = repoNames.join("\n");
      const repoNamesStr = `<p style="${colors};">Hello</p>`;

      fs.writeFile("resume.html", repoNamesStr, function(err) {
        if (err) {
          throw err;
        }

        // console.log(`Saved ${repoNames.length} repos`);
      });
    });
  });
