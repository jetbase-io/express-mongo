const permissions = {
  admin: [
    { action: 'create', enities: 'User', can: true },
    { action: 'delete', enities: 'User', can: true },
    { action: 'update', enities: 'User', can: true },
  ],
  user: [
    { action: 'read', enities: 'User', can: true },
  ],
  common: [
    { action: 'read', enities: 'User', can: true },
  ],
};

module.exports = permissions;
