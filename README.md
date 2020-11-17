# gulp-pug [![Build Status][status-img]][status] ![Dependencies][deps] ![Downloads][downloads]
> Gulp plugin for compiling Pug templates

This Gulp plugin enables you to compile your Pug templates into HTML or JS, with support for template locals, custom Pug filters, AMD wrapping, and others.  Here is a simple example using `gulp-pug`:

```javascript
var pug = require('gulp-pug');

gulp.task('views', function buildHTML() {
  return gulp.src('views/*.pug')
  .pipe(pug({
    // Your options in here.
  }))
});
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

## Thanks

 - Many thanks to [Blaine Bublitz][phated] for the original `gulp-jade` plugin.

## LICENSE

[MIT][license] &copy; Jamen Marzonie

[status]: https://travis-ci.org/gulp-community/gulp-pug
[status-img]: https://travis-ci.org/gulp-community/gulp-pug.png?branch=master
[deps]: https://david-dm.org/gulp-community/gulp-pug.svg
[downloads]: https://img.shields.io/npm/dm/gulp-pug.svg
[pug]: https://github.com/pugjs/pug
[api]: https://pugjs.org/api/reference.html
[gulp-data]: https://npmjs.com/gulp-data
[gulp-rename]: https://npmjs.com/gulp-rename
[gulp-wrap-amd]: https://github.com/phated/gulp-wrap-amd
[gulp-frontmatter-wrangler]: https://github.com/DougBeney/gulp-frontmatter-wrangler
[phated]: https://github.com/phated
[license]: LICENSE
