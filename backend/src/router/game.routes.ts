import express from "express";
import { GameController} from "../controller/game.controller";

export const router = express.Router()

router.post('/',GameController.addGame)

router.get('/', GameController.getGames)

router.get('/:id', GameController.getAGame)

router.put('/:id', GameController.updateGame)

router.delete('/:id', GameController.deleteGame)

export default router;
