import mongoose, {model} from 'mongoose';

interface Game extends mongoose.Document{
  id:string;
  level:number;
}

const GameSchema = new mongoose.Schema({
  level: {type: Number, required:true},
  }
);

export const Gamee = model<Game>('Game', GameSchema)
