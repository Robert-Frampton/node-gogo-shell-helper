'use strict';

var _ = require('lodash');
var chai = require('chai');
var GogoShell = require('gogo-shell');
var GogoShellHelper = require('../index');

var assert = chai.assert;

describe('gogo-shell-helper', function() {
	var helper;

	before(function() {
		helper = GogoShellHelper.start({
			commands: [
				{
					command: 'test',
					response: 'test'
				},
				{
					command: 'install webbundledir'
				},
				{
					command: 'install',
					multiResponse: ['1', '2', '3']
				}
			]
		});
	});

	after(function() {
		helper.close();
	});

	describe('start', function() {
		it('should connect to server', function(done) {
			var gogoShell = new GogoShell();

			var config = {
				host: '0.0.0.0',
				port: 1337
			};

			gogoShell.on('ready', function() {
				gogoShell.destroy();

				done();
			});

			gogoShell.connect(config);
		});
	});

	describe('_writeResponse', function() {
		it('should return dummy responses', function(done) {
			var gogoShell = new GogoShell();

			var config = {
				host: '0.0.0.0',
				port: 1337
			};

			gogoShell.connect(config)
				.then(function() {
					return gogoShell.sendCommand('test');
				})
				.then(function(data) {
					assert(data.indexOf('test\ng!') > -1);

					gogoShell.destroy();

					done();
				});
		});

		it('should combine async multiResponse data', function(done) {
			var gogoShell = new GogoShell();

			var config = {
				host: '0.0.0.0',
				port: 1337
			};

			gogoShell.connect(config)
				.then(function() {
					return gogoShell.sendCommand('install');
				})
				.then(function(data) {
					assert(data.indexOf('123\ng!') > -1);

					gogoShell.destroy();

					done();
				});
		});

		it('should return command if no response data exists', function(done) {
			var gogoShell = new GogoShell();

			var config = {
				host: '0.0.0.0',
				port: 1337
			};

			gogoShell.connect(config)
				.then(function() {
					return gogoShell.sendCommand('install webbundledir:file://test/test.war');
				})
				.then(function(data) {
					assert(data.indexOf('install webbundledir:file://test/test.war') > -1);

					gogoShell.destroy();

					done();
				});
		});

		it('should return received command if command does not exists', function(done) {
			var gogoShell = new GogoShell();

			var config = {
				host: '0.0.0.0',
				port: 1337
			};

			helper.setCommands([
				{
					command: 'test'
				}
			]);

			gogoShell.connect(config)
				.then(function() {
					return gogoShell.sendCommand('command that does not exist');
				})
				.then(function(data) {
					assert(data.indexOf('command that does not exist') > -1);

					gogoShell.destroy();

					done();
				});
		});
	});
});
