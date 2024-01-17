import {Gamee} from "../models/game.model";

export class gameService {

  async createGame(data: any) {
    try {
      return await Gamee.create(data)
    } catch (error) {
      console.log(error)
    }
  }

  async getGames() {
    try {
      return await Gamee.find({})
    } catch (error) {
      console.log(error)
    }
  }

  async getGame(id: string) {
    try {
      const game = await Gamee.findById({id:id})
      if (!game) {
        return 'game not available'
      }
      return game
    } catch (error) {
      console.log(error)
    }
  }

  async updateGame(id: string, data: any) {
    try {
      const gamez = await Gamee.findByIdAndUpdate({id:id}, data, {new: true})
      if(!gamez){
        return "post not available"
      }
      return gamez
    } catch (error) {
      console.log(error)
    }
  }

  async deleteGame(id: string) {
    try {
      const game = await Gamee.findByIdAndDelete(id)
      if (!game) {
        return 'post not available'
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const GameServices = new gameService()
