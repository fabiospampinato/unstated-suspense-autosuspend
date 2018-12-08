# Unstated Suspense Autosuspend

Automatically use [unstated-suspense](https://github.com/fabiospampinato/unstated-suspense) on all your container's API methods.

It supports methods returning promises, it re-throws any thrown exceptions, and it supports bubbling up the suspension to parent containers (in case you're using [unstated-compose](https://github.com/fabiospampinato/unstated-compose)).

Only methods defined in your container, and not somewhere further down in its prototype chain, will be autosuspended.

## Install

```sh
npm install --save unstated-suspense-autosuspend
```

## Usage

It supports a second optional options object which by default looks like this:

```js
{
  bubbles: Infinity, // How many levels to bubble up the suspension
  methods: /^(?!_|middleware)/ // Methods matching this regex will be autosuspended
}
```

Alternatively you can assign your options for `unstated-suspense-autosuspend` to your container's `autosuspend` property.

```ts
import autosuspend from 'unstated-suspense-autosuspend';
import {Container} from 'unstated-suspense';

class App extends Container {
  // autosuspend = false; // Disables `unstated-suspense-autosuspend` for this container
  // autosuspend = { bubbles: false } // Disables bubbling
  // autosuspend = { methods: /^api/ } // Only methods whose names start with "api" will be autosuspended
  constructor () {
    super ();
    autosuspend ( this );
    // autosuspend ( this, {...} ) // Passing custom options via the API
  }
  middlewareFoo () {} // Not autosuspended, it's name doesn't match `options.methods`
  _foo () {} // Not autosuspended, it's name doesn't match `options.methods`
  update () { // Autosuspended
    this.setFoo ( 11 );
    this.setBar ( 12 );
  }
  setFoo ( foo ) { // Autosuspended
    this.setState ({ foo });
  }
  setBar ( bar ) { // Autosuspended
    this.setState ({ bar });
  }
}
```

## Related

- **[unstated-with-containers](https://github.com/fabiospampinato/unstated-with-containers)**: Higher-Order Component for subscribing to containers.
- **[unstated-connect2](https://github.com/fabiospampinato/unstated-connect2)**: Connect containers to components, without sacrificing performance.
- **[unstated-hmr](https://github.com/fabiospampinato/unstated-hmr)**: Preserve containers' states across Hot-Module-Replacements.
- **[unstated-compose](https://github.com/fabiospampinato/unstated-compose)**: Compose multiple containers into one.
- **[unstated-compose-suspense](https://github.com/fabiospampinato/unstated-compose-suspense)**: Add suspend/unsuspend support to `unstated-compose`.
- **[unstated-compose-suspense-middleware](https://github.com/fabiospampinato/unstated-compose-suspense-middleware)**: Add middlewares support to `unstated-compose-suspense`.
- **[unstated-suspense](https://github.com/fabiospampinato/unstated-suspense)**: Suspend/unsuspend updates propagation from your containers.
- **[unstated-suspense-middleware](https://github.com/fabiospampinato/unstated-suspense-middleware)**: Add middlewares support to `unstated-suspense`.

## License

MIT © Fabio Spampinato
