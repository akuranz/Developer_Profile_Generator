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
      let userInfo = {
        location: res.data.location,
        profile: res.data.html_url,
        blog: res.data.blog,
        bio: res.data.bio,
        repos: res.data.public_repos,
        followers: res.data.followers,
        following: res.data.following,
        stars: res.data.public_gists
      };

      let {
        location,
        profile,
        blog,
        bio,
        repos,
        followers,
        following,
        stars
      } = userInfo;

      console.log(userInfo);

      const readFile = (file, encoding) =>
        new Promise(function(resolve, reject) {
          fs.readFile(file, encoding, function(err, data) {
            if (err) {
              return reject(err);
            }

            resolve(data);
          });
        });

      const writeFile = (file, data) =>
        new Promise(function(resolve, reject) {
          fs.writeFile(file, data, function(err) {
            if (err) {
              return reject(err);
            }
            resolve("Success");
          });
        });

      const writeTemplate = async () => {
        try {
          let template = await readFile("./template.html", "utf8");
          template = template.replace("{{colors}}", colors);
          writeFile("./resume1.html", template);
        } catch (error) {
          console.log(error);
        }
      };
      writeTemplate();

      //   const repoNames = res.data.map(function(repo) {
      //     return repo.name;
      //   });

      //   const repoNamesStr = repoNames.join("\n");
      //   const resumeString = `<p style="${location};">Hello</p>`;

      //   fs.writeFile("resume.html", resumeString, function(err) {
      //     if (err) {
      //       throw err;
      //     }

      //     // console.log(`Saved ${repoNames.length} repos`);
      //   });
    });
  });
