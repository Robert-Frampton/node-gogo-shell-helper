# gogo-shell-helper

## Install

```
$ npm install --save-dev gogo-shell-helper
```

## Usage

```js
var gogoShell = require('gogo-shell');
var GogoShellHelper = require('gogo-shell-helper');

var helper = GogoShellHelper.start({
    // host: '0.0.0.0',
    // port: 1337,
    commands: [
        {
            command: 'test',
            response: 'response'
        },
        {
            command: 'multi',
            multiResponse: ['response1', 'response2']
        },
        {
            command: 'returns this command'
        }
    ]
});

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
        // data = 'response\ng!'

        return gogoShell.sendCommand('multi');
    })
    .then(function(data) {
        // data = 'response1response1\ng!'

        return gogoShell.sendCommand('returns this command option --flag');
    })
    .then(function(data) {
        // data = 'returns this command option --flag\ng!'

        gogoShell.destroy();
    });
```

## API

### start(config)

#### config

type: `object`

##### config.commands

type: `array`

An array of objects containing mock commands

```js
commands: [
    {
        command: 'test',
        response: 'response'
    }
]
```

If `response` is omitted, it will return the `command` value. `multiResponse` is intended for an array of values that will be joined and returned.

##### config.host

type: `string`

##### config.port

type: `string`

### setCommands(commands)

#### commands

type: `array`

Overwrites the `commands` property set in the constructor.

### addCommand(command)

type: `object`

Adds command to `commands` array.
