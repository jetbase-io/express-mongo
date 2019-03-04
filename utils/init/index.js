import User from '../../models/user';

User.findOne({ email: 'admin@jetbase.com' })
  .then((user) => {
    if (!user) {
      User.create({
        email: 'admin@jetbase.com',
        password: 'jetbaseadmin',
        first_name: 'Admin',
        last_name: 'JetBase',
        role: 'admin',
      });
    }
  });
