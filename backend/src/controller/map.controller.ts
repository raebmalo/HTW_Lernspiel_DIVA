import { Request, Response } from 'express';
import {MapService} from '../services/map.service';

class mapController {
  createMap = async (req: Request, res: Response) => {
    const data = {
      level: req.body.level,
      map: req.body.map
    }
    const map = await MapService.createMap(data)
    res.status(201).send(map)
  }

  getMaps = async (req: Request, res: Response) => {
    const maps = await MapService.getMaps()
    res.send(maps)
  }

  getAMap = async (req: Request, res: Response) => {
    const id = req.params.id
    const map = await MapService.getMap(id)
    res.send(map)
  }

  updateMap = async (req: Request, res: Response) => {
    const id = req.params.id
    const map = await MapService.updateMap(id, req.body)
    res.send(map)
  }

  deleteMap = async (req: Request, res: Response) => {
    const id = req.params.id
    await MapService.deleteMap(id)
    res.send('map deleted')
  }
}

export const MapController = new mapController()
