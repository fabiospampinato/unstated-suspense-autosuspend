
/* IMPORT */

import * as _ from 'lodash';

/* AUTOSUSPEND */

const defaultOptions = {
  bubbles: Infinity, // How many levels to bubble up the suspension
  methods: /^(?!_|middleware)/ // Methods matching this regex will be autosuspended
};

function autosuspend ( container, options = container.autosuspend ) {

  if ( options === false ) return; // Disabled

  options = options ? Object.assign ( {}, defaultOptions, options ) : defaultOptions;

  const proto = Object.getPrototypeOf ( container );

  Object.keys ( container ).forEach ( key => {

    const method = container[key];

    if ( !_.isFunction ( method ) || proto[key] || !options.methods.test ( key ) ) return; // Not an API method

    function trigger ( method ) {

      let target = container,
          bubbles = options.bubbles;

      while ( bubbles && target.ctx && target.ctx[method] ) {
        target = target.ctx;
        bubbles -= 1;
      }

      target[method]();

    }

    function handleResult ( result ) {

      trigger ( 'unsuspend' );

      return result;

    }

    function handleError ( err ) {

      trigger ( 'unsuspend' );

      throw err;

    }

    function autosuspendWrapper () {

      try {

        trigger ( 'suspend' );

        const result = method.apply ( this, arguments );

        if ( result instanceof Promise ) {

          return result.then ( handleResult ).catch ( handleError )

        } else {

          return handleResult ( result );

        }

      } catch ( err ) {

        return handleError ( err );

      }

    }

    container[key] = autosuspendWrapper;

  });

};

/* EXPORT */

export default autosuspend;
