const db = require('../../Models');
const Event_User = db.event_user;
const Event = db.event;
const User = db.user;
const { Op } = require('sequelize');

exports.bookEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        // Store
        await Event_User.create({
            userId: req.user.id,
            eventId: eventId
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Be on time!'
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.myEventForUser = async (req, res) => {
    try {
        // Store
        const event_user = await Event_User.findAll({
            where: {
                userId: req.user.id
            },
            include: [{
                model: Event,
                as: "event"
            }]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Your event fetched successfully!',
            data: event_user
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.eventBookByUser = async (req, res) => {
    try {
        let condition;
        if (req.admin) {
            condition = { id: req.params.id };
        } else {
            const create = req.instructor ? req.instructor : req.institute;
            const createrId = create.id;
            condition = {
                id: req.params.id,
                createrId: createrId
            };
        }
        const event = await Event.findOne({
            where: condition
        });
        if (!event) {
            return res.status(400).send({
                success: false,
                message: "Event is not present!"
            });
        }
        // Store
        const event_user = await Event_User.findAll({
            where: {
                eventId: req.params.id
            }
        });
        const userId = [];
        for (let i = 0; i < event_user.length; i++) {
            userId.push(event_user[i].userId);
        }
        const user = await User.findAll({
            where: {
                id: userId
            },
            attributes: { exclude: ['password'] }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'User fetched successfully!',
            data: user,
            event: event
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};