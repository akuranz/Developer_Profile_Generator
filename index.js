const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
var pdf = require("html-pdf");

const writePDF = (outputPath, html) =>
  pdf.create(html, { format: "Letter" }).toFile(outputPath, function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });

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

// const path = require("path");
// const puppeteer = require("puppeteer");
// const handlebars = require("handlebars");
const writeResume = async (user, colorChoice, stars) => {
  console.log("colorChoice", colorChoice);
  console.log("writeStars", stars);
  try {
    let template = await readFile("./template.html", "utf8");

    //  template = template.replace("{colors}", user.colors);
    template = template.replace("{name}", user.name);
    template = template.replace("{company}", user.company);
    template = template.replace("{blog}", user.blog);
    template = template.replace("{profile}", user.html_url);
    // template = template.replace("{colors}", user.colors);

    let foundLocation = true,
      foundColors = true;
    while (foundLocation || foundColors) {
      if (template.indexOf("{location}") < 0) {
        foundLocation = false;
      } else {
        template = template.replace("{location}", user.location); // Try regex
      }

      if (template.indexOf("{colors}") < 0) {
        foundColors = false;
      } else {
        template = template.replace("{colors}", colorChoice); // Try regex
      }
    }

    template = template.replace("{bio}", user.bio);
    template = template.replace("{repos}", user.public_repos);
    template = template.replace("{followers}", user.followers);
    template = template.replace("{following}", user.following);
    template = template.replace("{avatar}", user.avatar_url);
    template = template.replace("{stars}", stars); //number of repost starred is length of object
    console.log(template);

    writePDF("./resume.pdf", template);
    writeFile("./resume.html", template);
  } catch (error) {
    console.log(error);
  }
};

let username = "";
let colors = "";
let stars = "";
function getStars(username) {
  const queryUrl2 = `https://api.github.com/users/${username}/starred`;
  axios.get(queryUrl2).then(function(res) {
    console.log("starred", res.data.length);
    stars = res.data.length;
  });
  return stars;
}

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
      choices: ["pink", "maroon", "green", "teal", "navy"]
    }
  ])
  .then(function(res) {
    username = res.username;
    colors = res.colors;
    const queryUrl = `https://api.github.com/users/${username}`;
    getStars(username);
    axios.get(queryUrl).then(function(res) {
      // console.log("data", res.data);
      console.log("colors", colors);
      writeResume(res.data, colors, stars);
    });
  });
