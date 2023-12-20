import {GameServices} from '../services/game.service'
import { Request, Response } from 'express'

class gameController {

  addGame = async (req: Request, res: Response) => {
    const data = {
      level: req.body.level
    }
    const game = await GameServices.createGame(data)
    res.status(201).send(game)
  }

  getGames = async (req: Request, res: Response) => {
    const games = await GameServices.getGames()
    res.send(games)
  }

  getAGame = async (req: Request, res: Response) => {
    const id = req.params.id
    const game = await GameServices.getGame(id)
    res.send(game)
  }

  updateGame = async (req: Request, res: Response) => {
    const id = req.params.id
    const game = await GameServices.updateGame(id, req.body)
    res.send(game)
  }

  deleteGame = async (req: Request, res: Response) => {
    const id = req.params.id
    await GameServices.deleteGame(id)
    res.send('post deleted')
  }
}

export const GameController = new gameController()
