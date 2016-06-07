'use strict';

var _ = require('lodash');
var net = require('net');

var COMMAND_END = '\ng! ';

var DEFAULT_RESPONSE_DATA = 'data\ng! ';

var HANDSHAKE_BUFFER = new Buffer([255, 251, 24, 255, 250, 24, 0, 86, 84, 50, 50, 48, 255, 240]);

var GogoShellHelper = function(config) {
	this.init(config);
};

GogoShellHelper.start = function(config) {
	return new GogoShellHelper(config);
};

GogoShellHelper.prototype = {
	init: function(config) {
		config = config || {};

		this._validateCommands(config.commands);

		this.commands = config.commands;
		this.host = config.host || '0.0.0.0';
		this.port = config.port || 1337;

		this._startServer();
	},

	addCommand: function(data) {
		this._validateCommand(data);

		this.commands.push(data);
	},

	close: function(cb) {
		this.gogoServer.close(cb);
	},

	setCommands: function(data) {
		this._validateCommands(data);

		this.commands = data;
	},

	_startServer: function() {
		var instance = this;

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
					var command = instance._writeResponse(socket, data);

					if (!command) {
						socket.write(data + COMMAND_END);
					}
				}
			});
		});

		this.gogoServer = gogoServer;

		gogoServer.listen(this.port, this.host);

		return gogoServer;
	},

	_validateCommand: function(data) {
		if (!_.isObject(data) || !data.command) {
			throw new Error('command must be an object and have command property');
		}
	},

	_validateCommands: function(data) {
		if (!_.isArray(data)) {
			throw new Error('commands must be an array of objects');
		}
		else {
			_.forEach(data, this._validateCommand);
		}
	},

	_writeResponse: function(socket, data) {
		return _.some(this.commands, function(item, index) {
			var command = item.command;

			if (_.startsWith(data, command)) {
				var response = item.response || item.multiResponse || '';

				socket.write(data);

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
	}
};

module.exports = GogoShellHelper;
