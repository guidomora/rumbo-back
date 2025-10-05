import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';

const router = Router();

router.post('/', tripController.createTrip);

export default router;