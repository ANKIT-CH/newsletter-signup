const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");
const { response } = require("express");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// const apiKey = "a221751845dba7de8eed7123xxxxxxxx-us20";
// const listId = "e31axxxxxx";

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
    update_existing: false,
  };
  const jsonData = JSON.stringify(data);

  const url =
    // "https://${dc}.api.mailchimp.com/3.0/lists/" +
    "https://us20.api.mailchimp.com/3.0/lists/" + listId;

  const options = {
    method: "POST",
    auth: "Ankit:" + apiKey,
  };
  // ("?skip_merge_validation=true&skip_duplicate_check=true");

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      const responseData = JSON.parse(data);
      console.log(responseData);
    });
    response.on("error", function (error) {
      console.log("error occurred is:", error);
    });
  });

  request.write(jsonData);
  request.end();

  console.log(firstName, lastName, email);
  console.log(response.statusCode);
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// app.post("/success", function (req, res) {
//   res.redirect("/");
// });

app.listen(process.env.PORT || 3000, function () {
  console.log("server started listening");
});
