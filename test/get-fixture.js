const fs = require('fs');
const path = require('path');
const Vinyl = require('vinyl');

/**
 * Returns a fixture as a buffered Vinyl object.
 *
 * - `cwd` is set to the `test` directory.
 * - `base` is set to the `test/fixtures` directory.
 *
 * @param name Filename of the fixture (including the extension)
 * @return Vinyl Buffered vinyl object.
 */
function getFixture(name) {
  const cwd = __dirname;
  const base = path.join(cwd, 'fixtures');
  const filePath = path.join(base, name);

  return new Vinyl({
    path: filePath,
    base: base,
    cwd: cwd,
    contents: fs.readFileSync(filePath),
  });
}

module.exports.getFixture = getFixture;
