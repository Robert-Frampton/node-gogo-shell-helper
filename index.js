'use strict';

var _ = require('lodash');
var net = require('net');

var COMMAND_END = '\ng! ';

var DEFAULT_RESPONSE_DATA = 'data\ng! ';

var HANDSHAKE_BUFFER = new Buffer([255, 251, 24, 255, 250, 24, 0, 86, 84, 50, 50, 48, 255, 240]);

function writeResponse(socket, data, dummyData) {
	return _.forEach(dummyData, function(item, index) {
		var command = item.command;

		if (_.startsWith(data, command)) {
			var response = item.response || item.multiResponse || data;

			if (_.isArray(response)) {
				_.forEach(response, function(chunk, index) {
					if (index + 1 == response.length) {
						chunk += COMMAND_END;
					}

					setTimeout(function() {
						socket.write(chunk);
					}, 100)
				});
			}
			else {
				socket.write(response + COMMAND_END);
			}

			return true;
		}
	});
};

function startServer(config, dummyData) {
	config = config || {};

	var gogoServer = net.createServer({
		allowHalfOpen: true
	}, function(socket) {
		socket.on('data', function(data) {
			data = data.toString();

			if (_.isEqual(data, HANDSHAKE_BUFFER.toString())) {
				socket.write('Welcome to Apache Felix Gogo\n');

				setTimeout(function() {
					socket.write(COMMAND_END);
				}, 100);
			}
			else {
				var dummyCommand = writeResponse(socket, data, dummyData);

				if (!dummyCommand) {
					socket.write(DEFAULT_RESPONSE_DATA);
				}
			}
		});
	});

	var host = config.host || '0.0.0.0';
	var port = config.port || 1337;

	gogoServer.listen(port, host);

	return gogoServer;
}

module.exports.startServer = startServer;
module.exports.writeResponse = writeResponse;
