import { AbilityBuilder } from '@casl/ability';
import permissions from './permissions';

const defineAbility = role => AbilityBuilder.define((can, cannot) => {
  permissions[role].forEach((item) => {
    if (item.can) {
      can(item.action, item.entities);
    } else {
      cannot(item.action, item.entities);
    }
  });
});

const admin = defineAbility('admin');
const user = defineAbility('user');
const common = defineAbility('common');

module.exports = { admin, user, common };
