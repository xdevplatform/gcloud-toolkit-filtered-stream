# get-fqdn

[![build status](https://img.shields.io/travis/com/niftylettuce/get-fqdn.svg)](https://travis-ci.com/niftylettuce/get-fqdn)
[![code coverage](https://img.shields.io/codecov/c/github/niftylettuce/get-fqdn.svg)](https://codecov.io/gh/niftylettuce/get-fqdn)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/niftylettuce/get-fqdn.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/get-fqdn.svg)](https://npm.im/get-fqdn)

> Lookup the fully qualified domain name ("FQDN") of the current server's IP (default) or a custom IP.  90x faster than `hostname -f` and works with Node v6.4+.


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Performance](#performance)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install get-fqdn
```

[yarn][]:

```sh
yarn add get-fqdn
```


## Usage

```js
const getFQDN = require('get-fqdn');

// async/await usage
(async () => {
  try {
    const fqdn = await getFQDN();
    console.log('fqdn', fqdn);
  } catch (err) {
    console.error(err);
  }
});

// then/catch usage
getFQDN().then(fqdn => console.log('fqdn', fqdn)).catch(console.error);

// callback usage
getFQDN((err, fqdn) => {
  if (err) return console.error(err);
  console.log('fqdn', fqdn);
});
```

Note that you can also pass a custom IP:

```js
const fqdn = await getFQDN('1.1.1.1');
console.log('fqdn', fqdn);
```


## Performance

This package runs approximately 90x faster than the alternative of using `hostname -f`.  It was built to ensure that my project [ForwardEmail.net](https://forwardemail.net) is as optimized as possible.  No other NPM packages existed that were similar, as all the others [were written in CoffeeScript](https://github.com/CliffS/fqdn-promise/blob/master/src/fqdn.coffee), used [deasync](https://github.com/rsrdesarrollo/node-fqdn/blob/master/index.js), or used the [hostname -f](https://github.com/fatelei/js-fqdn/blob/ffec496afb07559fb64dc5e6b78b50c6339d78c5/lib/fqdn.js) approach (also see the [fqdn][] package that uses the wrong approach too!).

> Test [#1](https://github.com/niftylettuce/get-fqdn/issues/1): uses native `os` and `dns` package:

```js
const os = require('os');
const dns = require('dns');

console.time('native nodejs dns lookup');
dns.lookup(os.hostname(), { hints: dns.ADDRCONFIG }, (err, ip) => {
  if (err) throw err;
  dns.lookupService(ip, 0, (err, fqdn) => {
    if (err) throw err;
    console.timeEnd('native nodejs dns lookup');
    console.log('fqdn', fqdn);
    process.exit(0);
  });
});
```

```sh
deploy@mx1:~/test$ node test1.js
native nodejs dns lookup: 1.603ms
fqdn mx1.forwardemail.net
```

> Test [#2](https://github.com/niftylettuce/get-fqdn/issues/2): uses `shelljs` and `hostname -f`:

```sh
deploy@mx1:~/test$ node test2.js
fqdn mx1.forwardemail.net
shelljs with hostname -f: 88.311ms
```


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[fqdn]: https://github.com/opentable/fqdn-nodejs
