import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';

const router = Router();

router.post('/', tripController.createTrip);
router.get('/', tripController.getPublishedTrips);

export default router;