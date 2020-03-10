import express from 'express';
import expressHandlebars from 'express-handlebars';
import path from 'path';

import log from './utils/log';
import replaceDomElement from './utils/replaceDomElem';

const app = express();
const handlebars = expressHandlebars.create();
app.use(replaceDomElement);
app.engine('hbs', handlebars.engine);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'hbs');
app.get('/*', (req, res) => {
  res.combine('portal', {
    url: 'http://localhost:3002/',
    placeholder: 'div#sidebar-app',
  });
});
app.listen(8080, () => {
  log('Server running... Visit http://localhost:8080 in your browser');
});
