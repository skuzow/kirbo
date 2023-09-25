import { model, Schema, Types } from 'mongoose';

export interface IAiringAnime {
  name: string;
  episode: number;
  airingDate: Date;
  subscribers: Types.ObjectId[];
}

const airingAnimeSchema = new Schema<IAiringAnime>({
  name: { type: String, required: true, unique: true },
  episode: { type: Number, required: true },
  airingDate: { type: Date, required: true },
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ]
});

export default model<IAiringAnime>('AiringAnime', airingAnimeSchema);
