import { Router } from 'express';
import { authenticate } from './authStrategy/passport';
import movieService from './service/movieService';
const router = Router();

router.get('/', async function (req, res) {

});
router.get('/:id', async function (req, res) {

});

router.post('/', authenticate('jwt', { session: false }), async function (req, res) {

});

router.put('/:id', authenticate('jwt', { session: false }), async function (req, res) {

});

router.delete('/:id', authenticate('jwt', { session: false }), async function (req, res) {

});

export default router;