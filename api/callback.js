export default async (req, res) => {
    const { code } = req.query;

    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).send(`Auth Error: ${data.error_description}`);
        }

        const postMessage = `
      <html>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                window.opener.postMessage(
                  'authorization:github:success:{"token":"${data.access_token}","provider":"github"}',
                  e.origin
                );
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:github", "*");
            })()
          </script>
        </body>
      </html>
    `;
        res.setHeader('Content-Type', 'text/html');
        res.send(postMessage);
    } catch (error) {
        res.status(500).send(`Server Error: ${error.message}`);
    }
};
