import User from '../../models/user';

User.findOne({ email: 'jetbaseadmin@jetbase.com' }).then((user) => {
  if (!user) {
    User.create({
      email: 'jetbaseadmin@jetbase.com',
      password: 'jetbaseadmin',
      first_name: 'Admin',
      last_name: 'JetBase',
      role: 'admin',
    });
  }
});
