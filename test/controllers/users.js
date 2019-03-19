import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import '@babel/polyfill';

import api from '../../app';
import User from '../../models/user';
import {
  dropDBs, loadFixture, withAdminLogin, withUserLogin,
} from '../utils';

chai.use(chaiHttp);

describe('User controller', () => {
  let user;

  before(async () => {
    await dropDBs();
    await loadFixture('users');
    user = await User.findOne({});
    expect(user).to.not.be.null; // eslint-disable-line
  });

  describe('get', () => {
    it('should return the right user via /api/v1/users/:userId', async () => {
      const response = await withUserLogin(chai.request(api).get(`/api/v1/users/${user.id}`));
      expect(response).to.have.status(200);
    });
  });

  describe('list', () => {
    it('should return the list of users', async () => {
      const response = await withUserLogin(chai.request(api).get('/api/v1/users'));
      expect(response).to.have.status(200);
    });
  });

  describe('create', () => {
    it('user should not create a user', async () => {
      const data = {
        email: 'test@jetbase.com',
        first_name: 'test',
        last_name: 'jetbase',
        password: 'jetbaseuser',
      };
      const response = await withUserLogin(chai.request(api).post('/api/v1/users').send(data));
      expect(response).to.have.status(403);
    });

    it('admin should create a user', async () => {
      const data = {
        email: 'test@jetbase.com',
        first_name: 'test',
        last_name: 'jetbase',
        password: 'jetbaseuser',
      };
      const response = await withAdminLogin(chai.request(api).post('/api/v1/users').send(data));
      expect(response).to.have.status(200);
      expect(response.body.data).have.property('email').eql('test@jetbase.com');
      expect(response.body.data).have.property('first_name').eql('test');
      expect(response.body.data).have.property('last_name').eql('jetbase');
    });
  });

  describe('update', () => {
    it('user should not update another user', async () => {
      const data = {
        first_name: 'user2',
        last_name: 'jetbase2',
      };
      const response = await withUserLogin(chai.request(api).put('/api/v1/users/5c7508ca9ce5b5d838296281').send(data));
      expect(response).to.have.status(403);
    });

    it('user should update self', async () => {
      const data = {
        first_name: 'user2',
        last_name: 'jetbase2',
      };
      const response = await withUserLogin(chai.request(api).put('/api/v1/users/5c7508ca9ce5b5d838296282').send(data));
      expect(response).to.have.status(200);
      expect(response.body.data).have.property('email').eql('user@jetbase.com');
      expect(response.body.data).have.property('first_name').eql('user2');
      expect(response.body.data).have.property('last_name').eql('jetbase2');
    });

    it('admin should update a user', async () => {
      const data = {
        first_name: 'user2',
        last_name: 'jetbase2',
      };
      const response = await withAdminLogin(chai.request(api).put('/api/v1/users/5c7508ca9ce5b5d838296282').send(data));
      expect(response).to.have.status(200);
      expect(response.body.data).have.property('email').eql('user@jetbase.com');
      expect(response.body.data).have.property('first_name').eql('user2');
      expect(response.body.data).have.property('last_name').eql('jetbase2');
    });
  });

  describe('delete', () => {
    it('user should not delete user', async () => {
      const response = await withUserLogin(chai.request(api).delete('/api/v1/users/5c7508ca9ce5b5d838296283'));
      expect(response).to.have.status(403);
    });

    it('admin should delete a user', async () => {
      const response = await withAdminLogin(chai.request(api).delete('/api/v1/users/5c7508ca9ce5b5d838296283'));
      expect(response).to.have.status(200);
    });
  });

  describe('update password', () => {
    it('user should not update password another user', async () => {
      const data = {
        oldpassword: 'jetbaseadmin',
        newpassword: 'jetbaseadmin2',
      };
      const response = await withUserLogin(chai.request(api)
        .put('/api/v1/users/5c7508ca9ce5b5d838296281/password').send(data));
      expect(response).to.have.status(403);
    });

    it('user should update self password', async () => {
      const data = {
        oldpassword: 'jetbaseadmin',
        newpassword: 'jetbaseadmin2',
      };
      const response = await withUserLogin(chai.request(api)
        .put('/api/v1/users/5c7508ca9ce5b5d838296282/password').send(data));
      expect(response).to.have.status(200);
    });

    it('admin should update password another user', async () => {
      const data = {
        oldpassword: 'jetbaseadmin',
        newpassword: 'jetbaseadmin2',
      };
      const response = await withAdminLogin(chai.request(api)
        .put('/api/v1/users/5c7508ca9ce5b5d838296282/password').send(data));
      expect(response).to.have.status(200);
    });
  });
});
