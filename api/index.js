const express = require("express");
const cors = require("cors");
const createClient = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
dotenv.config();

app.set("port", process.env.PORT || 3001);

const supabase = createClient.createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SERVICE
);

app.post("/api/signin", async (req, res) => {
  const account = req.body._account;

  try {
    let { data: user } = await supabase
      .from("users")
      .select()
      .eq("account", account)
      .single();
    // console.log('user found', user);

    if (!user) {
      const response = await supabase
        .from("users")
        .insert([{ account: account }]);
      // console.log('response', response)
      user = response.data;
    }
    // console.log('user after added to DB', user);

    const token = jwt.sign(
      {
        // ...user,
        aud: "authenticated",
        role: "authenticated",
        app_metadata: {
          id: user.id,
        },
        exp: Math.floor(Date.now() / 1000) + 7200,
      },
      process.env.REACT_APP_SUPABASE_JWT
    );

    res.send({ user: user, token: token });
  } catch (error) {
    var errMessage = `${error}`;
    processErrorResponse(res, 500, errMessage);
  }
});

// const https = require('https');
// const http = require('http');

function processErrorResponse(res, statusCode, message) {
  console.log(`${statusCode} ${message}`);
  res.status(statusCode).send({
    error: {
      status: statusCode,
      message: message,
    },
  });
}

app.listen(app.get("port"), function () {
  console.log(
    "Express app is running on port",
    app.get("port")
  );
});

module.exports = app;
