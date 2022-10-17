const express = require("express");
const cors = require("cors");
const createClient = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

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

app.get("/api/test", async (req, res) => {
  res.send("it worked");
});

app.post("/api/signin", async (req, res) => {
  const account = req.body._account;

  try {
    let { data: user } = await supabase
      .from("users")
      .select()
      .eq("account", account)
      .single();

    if (!user) {
      const response = await supabase
        .from("users")
        .insert([{ account: account }]);
      user = response.data;
    }

    const token = jwt.sign(
      {
        aud: "authenticated",
        role: "authenticated",
        app_metadata: {
          id: user.id,
        },
        exp: Math.floor(Date.now() / 1000) + 7200,
      },
      process.env.REACT_APP_SUPABASE_JWT
    );

    // Fetch info from graphql
    const endpoint = "http://goerli.indexer.frenslands.xyz:8080/graphql"
    // process.env.REACT_APP_GRAPHQL_URL
    const headers = {
      "content-type": "application/json",
    };
    const graphqlQuery = {
      operationName: "tokens",
      query: `query tokens($owner: HexValue) { tokens(owner: $owner) { tokenId owner } }`,
      variables: { owner: account },
    };
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(graphqlQuery),
    };

    var _lands;
    fetch(endpoint, options).then((response) =>
      response.json().then((data) => {
        _lands = data.data;
        if (data.data.tokens && data.data.tokens.length > 0) {
          data.data.tokens.forEach((land) => {
            supabase
              .from("lands_duplicate")
              .update([{ fk_userid: user.id }])
              .eq("tokenId", parseInt(land.tokenId))
              .then((data) => {})
              .catch((error) => {
                var errMessage = `${error}`;
                processErrorResponse(res, 500, errMessage);
              });
          });
        }

        res.json({ user: user, token: token, lands: _lands });
      })
    );
  } catch (error) {
    var errMessage = `${error}`;
    processErrorResponse(res, 500, errMessage);
  }
});

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
  console.log("Express app is running on port", app.get("port"));
});

module.exports = app;
