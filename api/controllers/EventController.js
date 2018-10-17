/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
    create: async function (req, res) {
        if (req.method == "GET")
            return res.view('event/create');

        if (typeof req.body.Event === "undefined")
            return res.badRequest("Form-data not received.");

        await Event.create(req.body.Event);

        return res.ok("Successfully created!");
    },

    // action - index
    index: async function (req, res) {

        var events = await Event.find();
        return res.view('event/index', { 'events': events });

    },
    // action - view
    view: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await Event.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('event/view', { 'event': model });

    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var models = await Event.destroy(req.params.id);

        if (models.length == 0) return res.notFound();

        return res.ok("Event Deleted.");

    },
    // action - update
    update: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (req.method == "GET") {

            var model = await Event.findOne(req.params.id);

            if (!model) return res.notFound();

            return res.view('event/update', { 'event': model });

        } else {

            if (typeof req.body.Event === "undefined")
                return res.badRequest("Form-data not received.");

            var models = await Event.update(req.params.id).set({
                eventname: req.body.Event.eventname,
                shortdescription: req.body.Event.shortdescription,
                fulldescription: req.body.Event.fulldescription,
                imageurl: req.body.Event.imageurl,
                organizer: req.body.Event.organizer
            }).fetch();

            if (models.length == 0) return res.notFound();

            return res.ok("Record updated");

        }
    },

};

