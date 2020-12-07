# node-sequential-promise

A tiny script to run async functions aka promises one after the other

## Usage

Import package:

```
import { runSequence } from "@klw/node-sequential-promise";
```

Your async functions must follow a few rules:

* If it's successful, if must return `true`
* If it fails, it must 
  * `Promise.reject("Your Error Message Here")` or 
  * return `false` (*soft fail* without an error message)

```
const myAsyncFunc1 = async () => {
    if (1 + 1 = 2) {
        return Promise.resolve(true);
    } else {
        return Promise.reject("Your Error Message Here");
    }
}
```

Run your async functions on the order you like:

```
const result = await runSequence([myAsyncFunc1, myAsyncFunc2, myAsyncFunc3]);
```

`node-sequential-promise` will run them one after the other.
* If one should fail, it will stop running all others.
* Even if it fails, you will get a resolved result.

## Return value

A positive result:
```
{
  success: true,
  started: [0, 1, 2],
  fulfilled: [0, 1, 2],
  errorMessage: undefined,
}
```

A negative result (2nd async function failed):
```
{
  success: false,
  started: [0, 1],
  fulfilled: [0],
  errorMessage: "Your Error Message Here",
}
```

A negative result (2nd async function failed) with a *soft fail*:
```
{
  success: false,
  started: [0, 1],
  fulfilled: [0],
  errorMessage: false,
}
```