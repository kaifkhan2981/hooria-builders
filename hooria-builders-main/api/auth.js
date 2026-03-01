export default (req, res) => {
  const { host } = req.headers;
  const redirectUri = `https://${host}/api/callback`;
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user`;
  res.redirect(githubUrl);
};
