# [cabyas.com](https://cabyas.com/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/8cc6229f-9e1f-41d4-bcbf-ad10b807a8f7/deploy-status)](https://app.netlify.com/sites/yasiel-blog/deploys)

My personal blog. Forked from [Dan Abramov](https://github.com/gaearon/overreacted.io)'s blog. Syntax theme based on [Sarah Drasner's Night Owl](https://github.com/sdras/night-owl-vscode-theme/) with small tweaks.

To run locally, `yarn`, then `yarn dev`, then open https://localhost:8000.

## Contributing Translations

You can translate any article on the website into your language!

Add a Markdown file with the translation to the corresponding article folder. For example `index.fr.md` in `src/pages/some=article/`.

If you're the first one to translate a post to your language, you'll need to add it to to the list in `./i18n.js`. See [this PR](https://github.com/gaearon/overreacted.io/pull/159) for an example. If your language needs special font characters, add it to the appropriate place in [this list](https://github.com/YasielCabrera/cabyas.com/blob/master/src/utils/i18n.js).

**Please don't send translations for the Spanish language — I will be translating into it myself when I find time.**
