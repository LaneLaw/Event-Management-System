/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.username) return res.badRequest();
        if (!req.body.password) return res.badRequest();

        var user = await User.findOne({ username: req.body.username });


        if (!user) {
            res.status(401);
            return res.send("User not found");
        }

        const match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) {
            res.status(401);
            return res.send("Wrong Password");
        }

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);
            req.session.username = req.body.username;
            req.session.role = user.role;
            req.session.user_id = user.id;

            sails.log("Session: " + JSON.stringify(req.session));

            // return res.json(req.session);

            if (req.wantsJSON) {
                return res.redirect('/');
            } else {
                return res.ok("Login successfully");
            }

        });


    },
    logout: async function (req, res) {

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.ok("Log out successfully");

        });
    },
    populate: async function (req, res) {

        if (!['register'].includes(req.params.association)) return res.notFound();

        const message = sails.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await User.findOne(req.params.id).populate(req.params.association);

        if (!model) return res.notFound();

        
        
        // const qPage = Math.max(req.query.page - 1, 0) || 0;
        // var models = await model.register({
        //     limit:2,
        //     skip:2*qPage,
        // })

        var numOfPage = Math.ceil(await model.register.length/ 3);

        return res.view('user/register', { 'model': model.register,'count': numOfPage, });

    },
    add: async function (req, res) {
        
        if (!['register'].includes(req.params.association)) return res.notFound();

        const message = sails.getInvalidIdMsg(req.params);
    
        if (message) return res.badRequest(message);
    
        if (!await User.findOne(req.params.id)) return res.notFound();
    
        if (req.params.association == "register") {
            if (!await Event.findOne(req.params.fk)) return res.notFound();
        }
        
        await User.addToCollection(req.params.id, req.params.association).members(req.params.fk);
    
        
        if (req.wantsJSON) {
            return res.redirect('/');
        } else {
            return res.ok("operation complete！");
        }
    },
    remove: async function (req, res) {

        if (!['register'].includes(req.params.association)) return res.notFound();
    
        const message = sails.getInvalidIdMsg(req.params);
    
        if (message) return res.badRequest(message);
    
        if (!await User.findOne(req.params.id)) return res.notFound();
    
        if (req.params.association == "register") {
            if (!await Event.findOne(req.params.fk)) return res.notFound();
        }
    
        await User.removeFromCollection(req.params.id, req.params.association).members(req.params.fk);
    
        return res.ok('Operation completed.');
    
    },
};

