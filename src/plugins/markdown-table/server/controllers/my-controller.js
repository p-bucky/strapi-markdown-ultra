'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('markdown-table')
      .service('myService')
      .getWelcomeMessage();
  },
});
