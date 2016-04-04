# gogo-shell-helper

## Install

```
$ npm install --save-dev gogo-shell-helper
```

## Usage

```js
var gogoShell = require('gogo-shell');
var helper = require('gogo-shell-helper');

var server = helper.startServer({
    // host: '0.0.0.0',
    // port: 1337
}, [
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
]);

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
        // data = 'response'

        return gogoShell.sendCommand('multi');
    })
    .then(function(data) {
        // data = 'response1response1'

        return gogoShell.sendCommand('returns this command option --flag');
    })
    .then(function(data) {
        // data = 'returns this command option --flag'

        gogoShell.destroy();
    });
```
