import express from 'express';
import {MapController } from '../controller/map.controller';

export const router = express.Router()

router.post('/', MapController.createMap);

router.get('/', MapController.getMaps);

router.get('/:id', MapController.getAMap);

router.put('/:id', MapController.updateMap);

router.delete('/:id', MapController.deleteMap);

export default router;
