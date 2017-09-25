function AppContext() {
    this.config = require('./api/config');
    this.database = require('./api/database'); // eslint-disable-line no-unused-vars
    this.logger = require('./api/logging');
}

const appcontext = new AppContext();
global.APP = appcontext;
