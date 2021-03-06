/**
 * Event.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  getInvalidIdMsg: function (opts) {

    if (typeof opts.id === "undefined" || isNaN(parseInt(opts.id)))
      return "Event id not specified or with incorrect type.";

    return null;        //falsy

  },
  attributes: {


    eventname: {
      type: "string"
    },
    shortdescription: {
      type: "string"
    },
    fulldescription: {
      type: "string"
    },
    imageurl: {
      type: "string"
    },
    eventdate: {
      type: "ref",
      columnType: 'datetime'
    },
    time: {
      type: "string"
    },
    organizer: {
      type: "string"
    },
    quota: {
      type: "integer"
    },
    venue: {
      type: "string"
    },
    highlight: {
      type: "string"
    },
    beReg: {
      collection: 'User',
      via: 'register'
    }

  },


};

