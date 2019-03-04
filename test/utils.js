import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import db from '../db';

export function withUserLogin(
  req,
  user = {
    _id: '5c7508ca9ce5b5d838296282',
    email: 'user@jetbase.com',
    role: 'user',
  },
) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '30m' });
  return req.set('Authorization', `Bearer ${token}`);
}

export function withAdminLogin(
  req,
  user = {
    _id: '5c7508ca9ce5b5d838296281',
    email: 'admin@jetbase.com',
    role: 'admin',
  },
) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '30m' });
  return req.set('Authorization', `Bearer ${token}`);
}

export async function dropDBs() {
  const mongo = await db;
  await mongo.connection.dropDatabase();
}

export async function loadFixture(...fixtures) {
  const filters = {
    Article: (articles) => {
      for (const article of articles) {
        article.enclosures = article.enclosures || [];
      }
      CreateFingerPrints(articles, 'STABLE');
      return articles;
    },
    Episode: (episodes) => {
      for (const episode of episodes) {
        episode.enclosures = episode.enclosures || [];
      }
      CreateFingerPrints(episodes, 'STABLE');
      return episodes;
    },
  };

  for (const fixture of fixtures) {
    const batch = require(`./fixtures/${fixture}.json`);

    for (const models of batch) {
      for (const modelName in models) {
        const fixedData = models[modelName].map((data) => {
          data = Object.assign({}, data);
          for (const key in data) {
            if (
              typeof data[key] !== 'number'
              && mongoose.Types.ObjectId.isValid(data[key])
            ) {
              data[key] = mongoose.Types.ObjectId(data[key]);
            }
          }
          return data;
        });
        const filter = filters[modelName] || (x => x);
        const filteredData = filter(fixedData);
        const modulePath = `../models/${modelName.toLowerCase()}`;
        const cachedModule = require.cache[require.resolve(modulePath)];
        const model = cachedModule ? cachedModule.exports : require(modulePath);
        await Promise.all(
          filteredData.map(f => model.create(f)),
        );
      }
    }
  }
}
