const ctx = require("../../../ctx");
module.exports = {
  AuthService: require('./AuthService')(ctx),
  EcosystemService: require('./EcosystemService'),
  EventService: require('./EventService'),
  MailService: require('./MailService')(ctx),
  PermissionService: require('./PermissionService'),
  ProjectService: require('./ProjectService'),
  RegistrationService: require('./RegistrationService'),
  StatsService: require('./StatsService')(ctx),
  StorageService: require('./StorageService')(ctx),
  UserService: require('./UserService'),
  TokenService: require('./TokenService')(ctx),
  CheckInService: require('./CheckInService'),
  RSVPService: require('./RSVPService'),
  TrackingService: require('./TrackingService')(ctx)
};
