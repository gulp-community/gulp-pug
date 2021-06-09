'use strict';

const expect = require('expect');
const fs = require('fs');
const { concat, from, pipe } = require('mississippi');
const path = require('path');
const pug = require('pug');
const through = require('through2');
const task = require('../');
const { getFixture } = require('./get-fixture');

// Mock Data Plugin
// (not testing the gulp-data plugin options, just that gulp-pug can get its
// data from file.data)
function setData() {
  return through.obj((file, _enc, cb) => {
    file.data = {
      title: 'Greetings!',
    };
    cb(null, file);
  });
}

function assertStream(options) {
  options = options || {};
  const ext = options.client ? '.js' : '.html';
  const compiler = options.client ? pug.compileClient : pug.compile;

  function assert(file) {
    options.filename = file.path.replace(new RegExp(ext + '$'), '.pug');
    const compiled = compiler(fs.readFileSync(options.filename), options);
    const data = Object.assign({}, options.data, options.locals, file.data);
    const expected = options.client ? compiled : compiled(data);
    expect(file.contents.toString()).toStrictEqual(expected);
    expect(path.extname(file.path)).toStrictEqual(ext);
    if (file.relative) {
      expect(path.extname(file.relative)).toStrictEqual(ext);
    } else {
      expect(path.extname(file.relative)).toStrictEqual('');
    }
  }

  return concat((files) => files.forEach(assert));
}

describe('test', function () {
  it('should compile my pug files into HTML', function (done) {
    pipe(
      [from.obj([getFixture('helloworld.pug')]), task(), assertStream()],
      done
    );
  });

  it('should compile my pug files into HTML with locals', function (done) {
    const options = {
      locals: {
        title: 'Yellow Curled',
      },
    };

    pipe(
      [
        from.obj([getFixture('helloworld.pug')]),
        task(options),
        assertStream(options),
      ],
      done
    );
  });

  it('should compile my pug files into HTML with data', function (done) {
    const options = {
      data: {
        title: 'Yellow Curled',
      },
    };

    pipe(
      [
        from.obj([getFixture('helloworld.pug')]),
        task(options),
        assertStream(options),
      ],
      done
    );
  });

  it('should compile my pug files into HTML with data property', function (done) {
    pipe(
      [
        from.obj([getFixture('helloworld.pug')]),
        setData(),
        task(),
        assertStream({ data: { title: 'Greetings' } }),
      ],
      done
    );
  });

  it('should compile my pug files into HTML with data from options and data property', function (done) {
    pipe(
      [
        from.obj([getFixture('helloworld.pug')]),
        setData(),
        task({ data: { foo: 'bar' } }),
        assertStream({ data: { title: 'Greetings', foo: 'bar' } }),
      ],
      done
    );
  });

  it('should overwrite data option fields with data property fields when compiling my pug files to HTML', function (done) {
    pipe(
      [
        from.obj([getFixture('helloworld.pug')]),
        setData(),
        task({ data: { title: 'Yellow Curled' } }),
        assertStream({ data: { title: 'Greetings' } }),
      ],
      done
    );
  });

  it('should not extend data property fields of other files', function (done) {
    pipe(
      [
        from.obj([getFixture('helloworld.pug'), getFixture('helloworld2.pug')]),
        through.obj((file, _enc, cb) => {
          if (path.basename(file.path) === 'helloworld.pug') {
            file.data = {
              title: 'Greetings!',
            };
          }
          cb(null, file);
        }),
        task(),
        assertStream(),
      ],
      done
    );
  });

  it('should compile my pug files into JS', function (done) {
    const options = { client: true };

    pipe(
      [
        from.obj([getFixture('helloworld.pug')]),
        task(options),
        assertStream(options),
      ],
      done
    );
  });

  it('should always return contents as buf with client = true', function (done) {
    function assert(files) {
      expect(files.length).toEqual(1);
      const newFile = files[0];
      expect(newFile.contents).toBeInstanceOf(Buffer);
    }

    pipe(
      [
        from.obj([getFixture('helloworld.pug')]),
        task({ client: true }),
        concat(assert),
      ],
      done
    );
  });

  it('should always return contents as buf with client = false', function (done) {
    function assert(files) {
      expect(files.length).toEqual(1);
      const newFile = files[0];
      expect(newFile.contents).toBeInstanceOf(Buffer);
    }

    pipe(
      [from.obj([getFixture('helloworld.pug')]), task(), concat(assert)],
      done
    );
  });
});
