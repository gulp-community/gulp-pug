import { Transform } from 'stream';
import { Options as PugOptions } from 'pug';

/**
 * Returns a stream that compiles Vinyl files as Pug.
 */
declare function GulpPug(options?: GulpPug.Options): Transform;

declare namespace GulpPug {
  /**
   * Any options from [Pug's API](https://pugjs.org/api/reference.html) in addition to `pug`'s own options.
   */
  interface Options extends PugOptions {
    /**
     * Locals to compile the Pug with. You can also provide locals through the `data` field of the file object,
     * e.g. with [`gulp-data`](https://npmjs.com/gulp-data). They will be merged with `opts.locals`.
     */
    locals?: any;

    /**
     * Same as `opts.locals`.
     */
    data?: any;

    /**
     * Compile Pug to JavaScript code.
     */
    client?: boolean;

    /**
     * If passed as a string, used as the name of your client side template function. If passed as a function, 
     * it is called with a pug template file as an argument, to obtain a name of client side template function.
     */
    name?: string | ((file: VinylFile) => string);

    /**
     * A custom instance of Pug for `gulp-pug` to use.
     */
    pug?: any;

    /**
     * Display name of file from stream that is being compiled.
     */
    verbose?: boolean;
  }
}

export = GulpPug;
