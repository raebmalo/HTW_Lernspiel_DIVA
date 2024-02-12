import mongoose, {model} from 'mongoose';

export interface Map extends Document{
  id: string;
  level: string;
  map: string[][];
}

const MapSchema = new mongoose.Schema({
    level: {type: String, required:true},
    map: [[String]],
  }
);

export const Mapp = model<Map>('Map', MapSchema)
