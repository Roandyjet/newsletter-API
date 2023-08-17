require("dotenv").config();
const express = require("express");
const app = express();
const client = require("mailchimp-marketing");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  client.setConfig({
    apiKey: process.env.CLIENT_API_KEY,
    server: "us7",
  });

  // audience id = list id

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
  };

  const run = async () => {
    try {
      const response = await client.lists.batchListMembers(
        process.env.LIST_ID,
        data
      );
      console.log(response);

      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      console.log("====== ERROR ======");
      console.log(JSON.parse(err.response.error.text).detail);
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
