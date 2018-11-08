/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = async function (cb) {
  sails.bcrypt = require('bcrypt');
  const saltRounds = 10;


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
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
