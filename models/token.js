import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';

const { Schema } = mongoose;

const TokenSchema = new Schema(
  {
    value: {
      type: String,
      index: true,
      required: true,
    },
  },
  { collection: 'tokens' },
);

TokenSchema.plugin(timestamps);
TokenSchema.plugin(mongooseStringQuery);
TokenSchema.index({ value: 1 });

module.exports = mongoose.model('Token', TokenSchema);
