/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  sails.getInvalidIdMsg = function (opts) {

    if (opts.id && isNaN(parseInt(opts.id))) {
        return "Primary key specfied is invalid (incorrect type).";
    }

    if (opts.fk && isNaN(parseInt(opts.fk))) {
        return "Foreign key specfied is invalid (incorrect type).";
    }

    return null;        // falsy

}

  sails.bcrypt = require('bcryptjs');
  const saltRounds = 10
  const hash = await sails.bcrypt.hash('123456', saltRounds);

  

  await User.createEach([
    { "username": "admin", "password": hash },
    { "username": "boss", "password": hash }
    // etc.
  ]);
  await Event.createEach([
    {
      "eventname": "A simple event",
      "shortdescription": "This is an innitial event",
      "fulldescription": "This event is saved in bootstrap.js",
      "imageurl": "https://pic1.zhimg.com/80/v2-40b17763b4eb99ed91c3be971516cc98_hd.jpg",
      "organizer": "o1",
      "eventdate": "11/26/2018",
      "time": "3:00",
      "venue": "v1",
      "quota": "123",
      "highlight": "Highlighted Event",
    },
    // etc.
  ]);
  const sim = await Event.findOne({ eventname: "A simple event" });

  const admin = await User.findOne({ username: "admin" });

  await User.addToCollection(admin.id, 'register').members(sim.id);
  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done();

};
