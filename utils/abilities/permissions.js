const permissions = {
  admin: [
    { action: 'create', entities: 'User', can: true },
    { action: 'delete', entities: 'User', can: true },
    { action: 'update', entities: 'User', can: true },
  ],
  user: [
    { action: 'read', entities: 'User', can: true },
  ],
  common: [
    { action: 'read', entities: 'User', can: true },
  ],
};

module.exports = permissions;
