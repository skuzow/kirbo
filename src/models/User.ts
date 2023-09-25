import { model, Schema } from 'mongoose';
import { unSuscribeUserFromAiringAnimes } from '../services/airingAnimeService.js';

export interface IUser {
  discordId: string;
  anilistUsername: string;
}

const userSchema = new Schema<IUser>({
  discordId: { type: String, required: true, unique: true },
  anilistUsername: { type: String, required: true }
});

userSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    const userId = doc._id;
    unSuscribeUserFromAiringAnimes(userId);
    next();
  }
);

export default model<IUser>('User', userSchema);
