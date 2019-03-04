import { AbilityBuilder } from '@casl/ability';
import permissions from './permissions';

const defineAbility = role => AbilityBuilder.define((can, cannot) => {
  permissions[role].forEach((item) => {
    if (item.can) {
      can(item.action, item.enities);
    } else {
      cannot(item.action, item.enities);
    }
  });
});

const admin = defineAbility('admin');
const user = defineAbility('user');
const common = defineAbility('common');

module.exports = { admin, user, common };
