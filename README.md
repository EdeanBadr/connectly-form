# Connectly GitHub Pages form

This static version can be hosted on GitHub Pages. It submits only `email` and `username` to the
configured Formspree endpoint. It does not request or collect passwords.

## Test locally

Open `index.html` in a browser. A live internet connection is required when submitting to
Formspree.

## Publish with GitHub Pages

1. Create a GitHub repository and add the four files in this folder.
2. Open the repository’s **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch and root folder, then save.

The Formspree endpoint is configured in the form `action` inside `index.html`.
