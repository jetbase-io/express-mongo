import Token from '../models/token';

exports.clearTokens = async () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  Token.deleteMany({ createdAt: { $lt: yesterday.toISOString() } });
};
