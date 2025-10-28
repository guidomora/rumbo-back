import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';

const router = Router();

router.post('/', tripController.createTrip);
router.get('/', tripController.getPublishedTrips);
router.get('/:tripId', tripController.getTripById);
router.post('/:tripId/select', tripController.selectTrip);
router.get('/users/:userId/last', tripController.getLastTripByUser);

export default router;