const express = require('express');
const passport = require('./authStrategy/passport');
const movieService = require('./service/movieService');
const router = express.Router();

router.get('/', async function (req, res) {

});
router.get('/:id', async function (req, res) {

});

router.post('/', passport.authenticate('jwt', { session: false }), async function (req, res) {

});

router.put('/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {

});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {

});

module.exports = router;