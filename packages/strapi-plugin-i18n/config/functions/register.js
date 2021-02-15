'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');
const { getService } = require('../../utils');

module.exports = () => {
  Object.values(strapi.models).forEach(model => {
    if (getService('content-types').isLocalized(model)) {
      _.set(model.attributes, 'localizations', {
        writable: false,
        private: false,
        configurable: false,
        type: 'json',
      });

      _.set(model.attributes, 'locale', {
        writable: false,
        private: false,
        configurable: false,
        type: 'string',
      });

      // add new route
      const route =
        model.kind === 'singleType'
          ? _.kebabCase(model.modelName)
          : _.kebabCase(pluralize(model.modelName));

      const localizationRoutes = [
        {
          method: 'POST',
          path: `/${route}/:id/localizations`,
          handler: `${model.modelName}.createLocalization`,
          config: {
            policies: [],
          },
        },
      ];

      const handler = function(ctx) {
        ctx.body = 'works';
      };

      strapi.config.routes.push(...localizationRoutes);

      _.set(
        strapi,
        `api.${model.apiName}.controllers.${model.modelName}.createLocalization`,
        handler
      );
    }
  });

  strapi.db.migrations.register({
    before() {},
    after() {},
  });
};
