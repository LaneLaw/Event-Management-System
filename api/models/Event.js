/**
 * Event.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

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
      type: "string"
    },
    time: {
      type: "string"
    },
    organizer: {
      type: "string"
    },
    quota: {
      type: "string"
    },
    venue: {
      type: "string"
    },
    highlight: {
      type: "string"
    }


  },

};

