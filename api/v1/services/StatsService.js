const _Promise = require('bluebird');

const Stat = require('../models/Stat');
const TrackingEvent = require('../models/TrackingEvent');

const utils = require('../utils');
const cache = utils.cache;

const STATS_CACHE_KEY = 'stats';

module.exports.createStat = function (category, stat, field) {
  return Stat.create(category, stat, field);
};

module.exports.statExists = function (category, stat, field) {
  return Stat.exists(category, stat, field);
};

module.exports.find = function (category, stat, field) {
  return Stat.where({
    category: category,
    stat: stat,
    field: field
  });
};

function _findAll(category, stat) {
  return Stat.where({
    category: category,
    stat: stat
  }).fetchAll();
}

module.exports.findAll = _findAll;

module.exports.incrementStat = function (category, stat, field) {
  cache.hasKey(STATS_CACHE_KEY).then((hasKey) => {
    if (!hasKey) {
      _resetCachedStat().then(() => _incrementCachedStat(category, stat, field));
    } else {
      _incrementCachedStat(category, stat, field);
    }
  });
  if(category == 'liveevent' && category == 'events') {
    return new _Promise();
  } 
  return Stat.increment(category, stat, field);
  
};

function _resetCachedStat() {
  const stats = {};
  stats['registration'] = {};
  stats['registration']['school'] = {};
  stats['registration']['transportation'] = {};
  stats['registration']['diet'] = {};
  stats['registration']['shirtSize'] = {};
  stats['registration']['gender'] = {};
  stats['registration']['graduationYear'] = {};
  stats['registration']['isNovice'] = {};
  stats['registration']['status'] = {};
  stats['registration']['major'] = {};
  stats['registration']['attendees'] = {};
  stats['rsvp'] = {};
  stats['rsvp']['school'] = {};
  stats['rsvp']['transportation'] = {};
  stats['rsvp']['diet'] = {};
  stats['rsvp']['shirtSize'] = {};
  stats['rsvp']['gender'] = {};
  stats['rsvp']['graduationYear'] = {};
  stats['rsvp']['isNovice'] = {};
  stats['rsvp']['major'] = {};
  stats['rsvp']['attendees'] = {};
  stats['liveevent'] = {};
  stats['liveevent']['attendees'] = {};
  stats['liveevent']['events'] = {};
  return cache.storeString(STATS_CACHE_KEY, JSON.stringify(stats));
}

function _incrementCachedStat(category, stat, field) {
  cache.getString(STATS_CACHE_KEY).then((object) => JSON.parse(object)).then((stats) => {
    if(stats == null) {
      stats = {};
    }
    if(stats[category] == null) {
      stats[category] = {};
    }
    if(stats[category][stat] == null) {
      stats[category][stat] = {};
    }
    if(stats[category][stat][field] == null) {
      stats[category][stat][field] = 0;
    }
    stats[category][stat][field] += 1;
    return cache.storeString(STATS_CACHE_KEY, JSON.stringify(stats));
  });
}

function _readStatsFromDatabase() {
  return _resetCachedStat().then(() => cache.getString(STATS_CACHE_KEY).then((object) => JSON.parse(object)).then((stats) => {

    const queries = [];
      
    queries.push(_findAll('registration', 'school').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['school'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'transportation').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['transportation'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'diet').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['diet'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'shirt_size').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['shirtSize'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'gender').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['gender'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'graduation_year').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['graduationYear'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'is_novice').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['isNovice'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'status').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['status'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'major').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['major'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('registration', 'attendees').then((collection) => {
      collection.forEach((model) => {
        stats['registration']['attendees'][model.get('field')] = model.get('count');
      });
    }));


    queries.push(_findAll('rsvp', 'school').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['school'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('rsvp', 'transportation').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['transportation'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('rsvp', 'diet').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['diet'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('rsvp', 'shirt_size').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['shirtSize'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('rsvp', 'gender').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['gender'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('rsvp', 'graduation_year').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['graduationYear'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('rsvp', 'is_novice').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['isNovice'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('rsvp', 'major').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['major'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(_findAll('rsvp', 'attendees').then((collection) => {
      collection.forEach((model) => {
        stats['rsvp']['attendees'][model.get('field')] = model.get('count');
      });
    }));


    queries.push(_findAll('liveevent', 'attendees').then((collection) => {
      collection.forEach((model) => {
        stats['liveevent']['attendees'][model.get('field')] = model.get('count');
      });
    }));

    queries.push(TrackingEvent.findAll().then((collection) => {
      collection.forEach((model) => {
        stats['liveevent']['events'][model.get('name')] = model.get('count');
      });
    }));

    return _Promise.all(queries).then(() => cache.storeString(STATS_CACHE_KEY, JSON.stringify(stats)));
    
  }));
}

/**
 * Fetches the current stats, requerying them if not cached
 * @return {Promise<Object>}	resolving to key-value pairs of stats
 */
function _fetchAllStats() {

  return cache.hasKey(STATS_CACHE_KEY).then((hasKey) => {
    if (!hasKey) {
      return _readStatsFromDatabase().then(() => cache.getString(STATS_CACHE_KEY).then((object) => JSON.parse(object)).then((stats) => stats));
    } 
    return cache.getString(STATS_CACHE_KEY).then((object) => JSON.parse(object)).then((stats) => stats);
    
  });
}

module.exports.fetchAllStats = _fetchAllStats;

module.exports.fetchRegistrationStats = function() {
  return _fetchAllStats().then((stats) => stats['registration']);
};

module.exports.fetchRSVPStats = function() {
  return _fetchAllStats().then((stats) => stats['rsvp']);
};

module.exports.fetchLiveEventStats = function() {
  return _fetchAllStats().then((stats) => stats['liveevent']);
};
