const http = require("http");
const fs = require("fs");
const https = require("https");

const creds = JSON.parse(
  fs.readFileSync("credentials/google-calendar.json", "utf8")
).installed;

const { client_id, client_secret } = creds;
const redirect_uri = "http://localhost:3847";
const scope = "https://www.googleapis.com/auth/calendar.readonly";

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}` +
  `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
  `&response_type=code&scope=${encodeURIComponent(scope)}` +
  `&access_type=offline&prompt=consent`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, redirect_uri);
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h2>Authorization failed — no code received.</h2>");
    server.close();
    process.exit(1);
  }

  const body =
    `code=${encodeURIComponent(code)}` +
    `&client_id=${encodeURIComponent(client_id)}` +
    `&client_secret=${encodeURIComponent(client_secret)}` +
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&grant_type=authorization_code`;

  const tokenReq = https.request(
    "https://oauth2.googleapis.com/token",
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    (tokenRes) => {
      let data = "";
      tokenRes.on("data", (chunk) => (data += chunk));
      tokenRes.on("end", () => {
        const tokens = JSON.parse(data);
        if (tokens.error) {
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end(`<h2>Token exchange failed: ${tokens.error_description}</h2>`);
          server.close();
          process.exit(1);
        }

        fs.writeFileSync(
          "credentials/google-calendar-token.json",
          JSON.stringify(tokens, null, 2) + "\n"
        );

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h2>Google Calendar authorized! You can close this tab.</h2>");
        console.log("Token saved to credentials/google-calendar-token.json");
        server.close();
      });
    }
  );
  tokenReq.write(body);
  tokenReq.end();
});

server.listen(3847, () => {
  console.log("Open this link in your browser to authorize:\n");
  console.log(authUrl + "\n");
  console.log("Waiting for authorization...");
});
