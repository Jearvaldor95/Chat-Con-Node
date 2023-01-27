const moment = require('moment');

function formatMessage(usuario, text) {
  return {
    usuario,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
