# Random.js

Random object contains different methods to generate or modify: random number, array (like noise) or 2d (like perlin).

```
 /**
 * @params {string | number | null} methodOrSeed
 *  if null
 *    use Math.random as random generator method
 *  else if number
 *    use default value primeNumber and use this value as argument
 *  else
 *    use the name of a random generator method:
 *      - primeNumber
 *      - mulberry32
 *      - xoshiro128ss
 *      - sfc32
 *      - JSF
 *      - LCG
 * @params {number[]} ...args
 *    random generator method arguments
 */

var r = new Random ( 'mulberry32', 42 );
r.random();
r.boolean();
r.range(10, 20);
r.unsignedInteger(5);
...
r.perlin(50, 50, 20, 1);
r.dice(5, 2);
...
```
