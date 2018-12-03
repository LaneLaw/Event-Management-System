/**
 * EventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
    // action - home
    home: async function (req, res) {

        var events = await Event.find({ limit: 4, sort: 'highlight' });
        return res.view('event/home', { 'events': events });

    },
    // action - create
    create: async function (req, res) {
        if (req.method == "GET")
            return res.view('event/create');

        if (typeof req.body.Event === "undefined")
            return res.badRequest("Form-data not received.");

        await Event.create(req.body.Event);

        return res.json("Successfully created!");
    },

    // action - index
    index: async function (req, res) {
        var events = await Event.find();
        return res.json(events);
        return res.view('event/index', { 'events': events });

    },

    highlight: async function (req, res) {
        var events = await Event.find({where: { highlight: { contains: 'h' } }});
        return res.json(events);
 

    },

    mdepartment: async function (req, res) {
        var events = await Event.find({where: { organizer: { contains: 'Music' } }});
        return res.json(events);
      

    },

    cdepartment: async function (req, res) {
        var events = await Event.find({where: { organizer: { contains: 'Computer' } }});
        return res.json(events);
    
    },

    // action - view
    view: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);
    
        if (message) return res.badRequest(message);

        var model = await Event.findOne(req.params.id);

        if (!model) return res.notFound();

        
        var models = await User.findOne(req.session.user_id).populate('register');

        return res.view('event/view', { 'event': model,'models': models.register });

    },
    view1: async function (req, res) {

        var message = Event.getInvalidIdMsg(req.params);
     
        if (message) return res.badRequest(message);

        var model = await Event.findOne(req.params.id);

        if (!model) return res.notFound();


        return res.view('event/view1', { 'event': model});

    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var message = Event.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var models = await Event.destroy(req.params.id);

        if (models == 0) return res.notFound();

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
                organizer: req.body.Event.organizer,
                eventdate: req.body.Event.eventdate,
                time: req.body.Event.time,
                venue: req.body.Event.venue,
                quota: req.body.Event.quota,
                highlight: req.body.Event.highlight
            }).fetch();

            if (models.length == 0) return res.notFound();

            // res.redirect('/');
            return res.ok('Record updated');

        }
    },
    // search function
    search: async function (req, res) {

        const qName = req.query.eventname || "";
        const qOrganizer = req.query.organizer || "";
        const qEventdateS = req.query.eventdates || "";
        const qEventdateE = req.query.eventdatee || "";
        const qVenue = req.query.venue || "";
        const qPage = Math.max(req.query.page - 1, 0) || 0;


        if (qName != "") {
            var events = await Event.find({
                where: { eventname: { contains: qName } },
                sort: 'eventname',
                limit: 2,
                skip: 2 * qPage
            });
        } else {
            var events = await Event.find({
                where: { eventname: { contains: qName }, organizer: { contains: qOrganizer }, eventdate: { '>=': qEventdateS, '<=': qEventdateE }, venue: { contains: qVenue } },
                sort: 'eventname',
                limit: 2,
                skip: 2 * qPage
            });
        }
        var numOfPage = Math.ceil(await Event.count() / 2);

        var url = "search?eventname=" + qName + "&organizer=" + qOrganizer + "&eventdates=" + qEventdateS + "&eventdatee=" + qEventdateE + "&venue=" + qVenue;

        return res.view('event/search', { 'events': events, 'count': numOfPage, 'url': url });
    },
    // action - paginate
    paginate: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;

        const numOfItemsPerPage = 2;

        var events = await Event.find({
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        var numOfPage = Math.ceil(await Event.count() / numOfItemsPerPage);

        return res.view('event/paginate', { 'events': events, 'count': numOfPage });
    },
    // action - populate
    populate: async function (req, res) {

        if (!['beReg'].includes(req.params.association)) return res.notFound();

        const message = sails.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await Event.findOne(req.params.id).populate(req.params.association);

        if (!model) return res.notFound();

        // return res.json(model);
        return res.view('event/beReg', { 'model': model.beReg});
    },
    customToJSON: function() {
        // Return a shallow copy of this record with the password removed.
        return _.omit(this, ['password'])
    },

};

