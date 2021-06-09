<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="257" src="https://raw.githubusercontent.com/gulpjs/artwork/master/community/logo-2021/community.png">
  </a>
</p>

# gulp-pug

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Gulp plugin for compiling Pug templates. Enabling you to compile your Pug templates into HTML or JS, with support for template locals, custom Pug filters, AMD wrapping, and others.

## Usage

```js
const { src, dest } = require('gulp');
const pug = require('gulp-pug');

exports.views = () => {
  return src('./src/*.pug')
    .pipe(
      pug({
        // Your options in here.
      })
    )
    .pipe(dest('./dist'));
};
```

## API

### `pug([opts])`

- `opts` (`Object`): Any options from [Pug's API][api] in addition to `pug`'s own options.
- `opts.locals` (`Object`): Locals to compile the Pug with. You can also provide locals through the `data` field of the file object, e.g. with [`gulp-data`][gulp-data]. They will be merged with `opts.locals`.
- `opts.data` (`Object`): Same as `opts.locals`.
- `opts.client` (`Boolean`): Compile Pug to JavaScript code.
- `opts.pug`: A custom instance of Pug for `gulp-pug` to use.
- `opts.verbose`: display name of file from stream that is being compiled.

To change `opts.filename` use [`gulp-rename`][gulp-rename] before `gulp-pug`.

Returns a stream that compiles Vinyl files as Pug.

## Also See

- [`pug`][pug]
- [`gulp-data`][gulp-data]: Using locals in your Pug templates easier.
- [`gulp-rename`][gulp-rename]: Change `opts.filename` passed into Pug.
- [`gulp-wrap-amd`][gulp-wrap-amd]: Wrap your Pug in an AMD wrapper.
- [`gulp-frontmatter-wrangler`][gulp-frontmatter-wrangler]: Useful if you need YAML frontmatter at the top of your Pug file.

## License

MIT

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/gulp-pug.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/gulp-pug
[npm-image]: https://img.shields.io/npm/v/gulp-pug.svg?style=flat-square

[ci-url]: https://github.com/gulp-community/gulp-pug/actions?query=workflow:dev
[ci-image]: https://img.shields.io/github/workflow/status/gulp-community/gulp-pug/dev?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulp-community/gulp-pug
[coveralls-image]: https://img.shields.io/coveralls/gulp-community/gulp-pug/master.svg?style=flat-square
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
[pug]: https://github.com/pugjs/pug
[api]: https://pugjs.org/api/reference.html
[gulp-data]: https://npmjs.com/gulp-data
[gulp-rename]: https://npmjs.com/gulp-rename
[gulp-wrap-amd]: https://github.com/phated/gulp-wrap-amd
[gulp-frontmatter-wrangler]: https://github.com/DougBeney/gulp-frontmatter-wrangler
<!-- prettier-ignore-end -->
