import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';

const router = Router();


router.get('/reservations', tripController.getAllReservations);
router.post('/', tripController.createTrip);
router.get('/', tripController.getPublishedTrips);

router.get('/:tripId', tripController.getTripById);
router.post('/:tripId/select', tripController.selectTrip);
router.get('/users/:userId/last', tripController.getLastTripByUser);
router.get('/users/:userId/trips', tripController.getTripsByUser);


export default router;