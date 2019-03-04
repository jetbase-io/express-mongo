import mongoose from 'mongoose';

import bcrypt from 'bcrypt';
import mongooseBcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      required: true,
    },
    first_name: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      required: true,
    },
    last_name: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      bcrypt: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { collection: 'users' },
);

UserSchema.methods.isValidPassword = async (user, password) => {
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

UserSchema.plugin(mongooseBcrypt);
UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
