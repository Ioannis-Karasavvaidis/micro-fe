import cheerio from 'cheerio';
import isUrl from 'is-url';
import fetch from 'node-fetch';

export default (req, res, next) => {
  res.combine = async (view, config, callback) => {
    const { placeHolder, url } = config;
    if (!url) {
      res.render(view, config, callback);
    } else if (isUrl(url)) {
      const response = await fetch(url);
      const content = await response.text();
      const product = cheerio.load(content);
      product('head').prepend(`<base href="${url}">`);
      res.render(view, config, (err, html) => {
        if (err) next(err);
        const portal = cheerio.load(html);
        const portalHead = portal('head');
        if (portalHead && portalHead.length > 0) {
          product('head').append(portalHead.html());
        }
        const portalBody = portal('body');
        if (portalBody && portalBody.length > 0) {
          product(placeHolder).html(portalBody.html());
        } else {
          product(placeHolder).html(portal.html());
        }
        res.status(200).send(product.html());
      });
    } else {
      res
        .status(500)
        .send('Please provide a real url')
        .end();
    }
  };

  next();
};
