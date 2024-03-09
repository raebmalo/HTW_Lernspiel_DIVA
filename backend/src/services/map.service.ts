import {Mapp} from '../models/map.model';

export class mapService {
  async createMap(data: any){
    try {
      return await Mapp.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getMaps() {
    try {
      return await Mapp.find({})
    } catch (error) {
      console.log(error)
    }
  }

  async getMap(id: string) {
    try {
      const map = await Mapp.findById({_id:id})
      if (!map) {
        return 'map not available'
      }
      return map
    } catch (error) {
      console.log(error)
    }
  }

  async updateMap(id: string, data: any) {
    try {
      const mapz = await Mapp.findByIdAndUpdate({_id:id}, data, {new: true})
      if(!mapz){
        return "post not available"
      }
      return mapz
    } catch (error) {
      console.log(error)
    }
  }

  async deleteMap(id: string) {
    try {
      const map = await Mapp.findByIdAndDelete(id)
      if (!map) {
        return 'post not available'
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const MapService = new mapService()
