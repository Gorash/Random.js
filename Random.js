/*
    Random.js

    Random object contains different methods to generate or modify: random number, array (like noise) or 2d (like perlin).

    new Random ( seed );
    seed is optional:
     - if seed == null: generate a random seed with Math.random
     - if seed === null, Math.random is used to generate the noise).

    ***************

    Copyright (c) 2013, Christophe Matthieu
    https://github.com/Gorash

    Released under the MIT license

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
    Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
    AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function (module){
"use strict";

function Random (seed) {
    if (seed == null) {
        if (seed === null) this.random = Math.random;
        this._seed = Math.random() * 2147483647 | 0;
    } else {
        this._seed = seed | 0;
    }
    this._init = this._seed;
    this.seed();
}
Random.prototype.seed = function seed () {
    return this._seed = (this._seed+1) * 36873.0 % 2147483647 | 0;
};
/*
 * @return: random number
 *
 */
Random.prototype.random = function random () {
    return this.seed() / 2147483647;
};
Random.prototype.seedRandom = function seedRandom (nb) {
    this._seed = (this._seed+(nb|0)+1) * 36873.0 % 2147483647 | 0;
    return this._seed / 2147483647;
};
Random.prototype.boolean = function boolean () {
    return this.random() >= 0.5;
};
Random.prototype.range = function range (min, max) {
    return min + (this.random() * (max - min));
};
Random.prototype.unsignedInteger = function unsignedInteger (max) {
    return Math.round(this.random()*max);
};
Random.prototype.NonUniformRandom = function NonUniformRandom (min, max) {
    var rand = (this.random() * (max - min));
    return min + (this.random() * rand);
};

//////////////////// Array //////////////////////////

/*
 * @return:
 *  Array of random numbers
 *
 */
Random.prototype.array = function array (length) {
    var res = [];
    for (var x=0; x<length; x++) {
        res.push( this.random() );
    }
    return res;
};
Random.prototype.noise = function noise (min, max, length) {
    var res = [];
    var rand;
    var isFloat = typeof min === 'number' && min % 1 !== 0 ||
                  typeof max === 'number' && max % 1 !== 0;
    for (var x=0; x<length; x++) {
        rand = this.range(max, min);
        res.push(isFloat ? rand : Math.round(rand));
    }
    return res;
};
Random.prototype.uniform = function uniform (length) {
    var res = [];
    for (var x=0; x<length; x++) {
        res.push( this.random()*2-1 );
    }
    return res;
};
Random.prototype.nonUniform = function nonUniform (min, max, length) {
    var res = [];
    var rand;
    var isFloat = typeof min === 'number' && min % 1 !== 0 ||
                  typeof max === 'number' && max % 1 !== 0;
    for (var x=0; x<length; x++) {
        rand = this.NonUniformRandom(max, min);
        res.push(isFloat ? rand : Math.round(rand));
    }
    return res;
};
Random.prototype.smooth = function smooth (min, max, length) {
    return Random.smooth(this.noise(min, max, length+1));
};
Random.prototype.smoother = function smoother (min, max, length) {
    return Random.smoother(this.noise(min, max, length+2));
};
Random.prototype.red = function red (length) {
    return Random.red(this.uniform(length+1));
};
Random.prototype.pink = function pink (length) {
    return Random.pink(this.uniform(length+1));
};
Random.prototype.AdjacentMin = function AdjacentMin (length) {
    return Random.AdjacentMin(this.uniform(length));
};
Random.prototype.AdjacentMax = function AdjacentMax (length) {
    return Random.AdjacentMax(this.uniform(length));
};
Random.prototype.AdjacentAverage = function AdjacentAverage (length) {
    return Random.AdjacentAverage(this.uniform(length));
};

/* Noise effects */

Random.smooth = function smooth (noise) {
    var length = noise.length;
    var Res = [];
    for (var j=0; j<length; j++) {
        Res.push(Math.min(noise[j], j+1 === length ? noise[0] : noise[j+1]));
    }
    return Res;
};
Random.red = function red (noise) {
    var length = noise.length;
    var Res = [];
    for (var j=0; j<length; j++) {
        Res.push(0.5 * (res[j] + Res[j+1]));
    }
    return Res;
};
Random.pink = function pink (noise) {
    var length = noise.length;
    var Res = [];
    for (var j=0; j<length; j++) {
        Res.push(0.5 * (res[j] - Res[j+1]));
    }
    return Res;
};
Random.AdjacentMin = function AdjacentMin (noise) {
    var res = [],
        size = noise.length;
    for (var j=0; j<size; j++) {
        res.push(Math.min(noise[j], noise[j+1] === undefined ? noise[0] : noise[j+1]));
    }
    return res;
};
Random.AdjacentMax = function AdjacentMax (noise) {
    var res = [],
        size = noise.length;
    for (var j=0; j<size; j++) {
        res.push(Math.max(noise[j], noise[j+1] === undefined ? noise[0] : noise[j+1]));
    }
    return res;
};
Random.AdjacentAverage = function AdjacentAverage (noise) {
    var res = [],
        size = noise.length;
    for (var j=0; j<size; j++) {
        res.push(0.5 * (noise[j] + (noise[j+1] || 0)));
    }
    return res;
};

//////////////////// Array 2D //////////////////////////

/*
 * perlin as static
 * @value:
 *  - width: {int}
 *  - height: {int}
 *  - x: {float} by default 0.0
 *  - y: {float} by default 0.0
 *  - z: {float} by default 0.0
 *  - octaves: {int} by default 4
 *  - falloff: {decimal} by default 0.5
 *  - perlin: by default self seed
 *    {int} seed to create noise
 *    {array} initial noise
 * @return:
 *  Array [x][y] with value between 0 and 1 of random or pseudo random values
 *
 */
Random.perlin = function perlin (noise, width, height, x, y, z, octaves, falloff) {
    var _x = x || 0.0;
    var _y = y || 0.0;
    var _z = z || 0.0;
    var octaves = octaves || 4;
    var falloff = falloff || 0.5;
    var noise = noise || new Random(null).noise(0, 255, 512);

    var baseFactor = 1/64;
    var aOctFreq = [];
    var aOctPers = [];
    var fPersMax = 0.0;
    var fFreq, fPers, error;

    var baseX = _x * baseFactor;
    _y = _y * baseFactor;
    _z = _z * baseFactor;

    for (var i=1;i<=width*baseFactor; i++) {
        if((baseX+i)*baseFactor%1===0) {
            console.log("Some artefacts can appear for this x value.");
        }
    }
    for (var i=1;i<=height*baseFactor; i++) {
        if((_y+i)*baseFactor%1===0) {
            console.log("Some artefacts can appear for this y value.");
        }
    }

    for(var i=0; i<octaves; i++) {
        fFreq = Math.pow(2,i);
        fPers = Math.pow(falloff,i);
        fPersMax += fPers;
        aOctFreq.push(fFreq);
        aOctPers.push(fPers);
    }
    fPersMax = 1 / fPersMax;

    var max = 0;
    var min = Infinity;
    var bitmap = new Array();
    for(var px=0; px<width; px++) {
        bitmap[px] = [];
    }

    var cg = function (hash, x,y,z) {
        return ((hash & 1) === 0?hash < 8?x:y:hash < 8?-x:-y) + ((hash & 2) === 0?hash < 4?y:hash === 12?x:z:hash < 4?-y:hash === 14?-x:-z);
    };
    
    for(var py=0; py<height; py++) {
        _x = baseX;
        for(var px=0; px<width; px++) {
            var s = 0.0;
            var oi = 0;
            for(var i=0; i<octaves; i++) {
                var fFreq1 = aOctFreq[i];
                var fPers1 = aOctPers[i];
                var x = _x * fFreq1;
                var y = _y * fFreq1;
                var z = _z * fFreq1;
                var X = x & 255;
                var Y = y & 255;
                var Z = z & 255;
                var A = noise[X] + Y;
                var AA = noise[A] + Z;
                var AB = noise[A + 1] + Z;
                var B = noise[X + 1] + Y;
                var BA = noise[B] + Z;
                var BB = noise[B + 1] + Z;
                x = x % 1;
                y = y % 1;
                z = z % 1;
                var x1 = x - 1;
                var y1 = y - 1;
                var z1 = z - 1;
                var g1 = cg(noise[BB + 1] & 15, x1,y1,z1);
                var g2 = cg(noise[AB + 1] & 15, x,y1,z1);
                var g3 = cg(noise[BA + 1] & 15, x1,y,z1);
                var g4 = cg(noise[AA + 1] & 15, x,y,z1);
                var g5 = cg(noise[BB] & 15, x1,y1,z);
                var g6 = cg(noise[AB] & 15, x,y1,z);
                var g7 = cg(noise[BA] & 15, x1,y,z);
                var g8 = cg(noise[AA] & 15, x,y,z);
                var u = x * x * x * (x * (x * 6 - 15) + 10);
                var v = y * y * y * (y * (y * 6 - 15) + 10);
                var w = z * z * z * (z * (z * 6 - 15) + 10);
                g2 += u * (g1 - g2);
                g4 += u * (g3 - g4);
                g6 += u * (g5 - g6);
                g8 += u * (g7 - g8);
                g4 += v * (g2 - g4);
                g8 += v * (g6 - g8);
                s += (g8 + w * (g4 - g8)) * fPers1;
            }

            var color = s * fPersMax + 1;
            bitmap[px][py] = color;
            if (max < color) max = color;
            if (min > color) min = color;

            _x += baseFactor;
        }
        _y += baseFactor;
    }

    for (var px=0;px<width; px++) {
        for (var py=0;py<height; py++) {
            bitmap[px][py] = (bitmap[px][py]-min)/(max-min);
        }
    }

    return bitmap;
};
/*
 * perlin
 * @value:
 *  - width: {int} (size is ceiled to the nearest power of two)
 *  - height: {int}
 *  - roughness {int > 0} is 20 by default
 *  - unitSize {int > 0} is 1 by default
 * @return:
 *  Array [x][y] with value between 0 and 1 of random or pseudo random values
 *
 */
Random.prototype.perlin = function perlin (width, height, roughness, unitSize) {
    // Setup the map array for use
    var self = this;
    var map = [];
    var mapDimension = Math.pow(2, Math.ceil(Math.log(Math.max(width, height))/Math.log(2))) || 256;
    var inc = 0;
    var roughness = roughness || 20;
    var unitSize = unitSize || 1;

    for(var x = 0; x <= mapDimension; x++){
        for(var y = 0; y <= mapDimension; y++){
            map[x] = [];
        }
    }

    // Starts off the map generation, seeds the first 4 corners
    function startDisplacement(){
        var x = mapDimension,
            y = mapDimension,
            tr, tl, t, br, bl, b, r, l, center;
        
        // top left
        map[0][0] = self.random();
        tl = map[0][0];
        
        // bottom left
        map[0][mapDimension] = self.random();
        bl = map[0][mapDimension];
        
        // top right
        map[mapDimension][0] = self.random();
        tr = map[mapDimension][0];
        
        // bottom right
        map[mapDimension][mapDimension] = self.random();
        br = map[mapDimension][mapDimension];
        
        // Center
        map[mapDimension / 2][mapDimension / 2] = map[0][0] + map[0][mapDimension] + map[mapDimension][0] + map[mapDimension][mapDimension] / 4;
        map[mapDimension / 2][mapDimension / 2] = normalize(map[mapDimension / 2][mapDimension / 2]);
        center = map[mapDimension / 2][mapDimension / 2];
        
        map[mapDimension / 2][mapDimension] = bl + br + center / 3;
        map[mapDimension / 2][0] = tl + tr + center / 3;
        map[mapDimension][mapDimension / 2] = tr + br + center / 3;
        map[0][mapDimension / 2] = tl + bl + center / 3;
        
        // Call displacment 
        midpointDisplacment(mapDimension);
    }

    // Workhorse of the terrain generation.
    function midpointDisplacment(dimension){
        var newDimension = dimension / 2,
            top, topRight, topLeft, bottom, bottomLeft, bottomRight, right, left, center,
            i, j;
        
        if (newDimension > unitSize){
            for(i = newDimension; i <= mapDimension; i += newDimension){
                for(j = newDimension; j <= mapDimension; j += newDimension){
                    x = i - (newDimension / 2);
                    y = j - (newDimension / 2);
                    
                    topLeft = map[i - newDimension][j - newDimension];
                    topRight = map[i][j - newDimension];
                    bottomLeft = map[i - newDimension][j];
                    bottomRight = map[i][j];
                    
                    // Center                
                    map[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(dimension);
                    map[x][y] = normalize(map[x][y]);
                    center = map[x][y];
                    
                    // Top
                    if(j - (newDimension * 2) + (newDimension / 2) > 0){
                        map[x][j - newDimension] = (topLeft + topRight + center + map[x][j - dimension + (newDimension / 2)]) / 4 + displace(dimension);;
                    }else{
                        map[x][j - newDimension] = (topLeft + topRight + center) / 3 + displace(dimension);
                    }
                    
                    map[x][j - newDimension] = normalize(map[x][j - newDimension]);
            
                    // Bottom
                    if(j + (newDimension / 2) < mapDimension){
                        map[x][j] = (bottomLeft + bottomRight + center + map[x][j + (newDimension / 2)]) / 4 + displace(dimension);
                    }else{
                        map[x][j] = (bottomLeft + bottomRight + center) / 3+ displace(dimension);
                    }
                    
                    map[x][j] = normalize(map[x][j]);

                    
                    //Right
                    if(i + (newDimension / 2) < mapDimension){
                        map[i][y] = (topRight + bottomRight + center + map[i + (newDimension / 2)][y]) / 4 + displace(dimension);
                    }else{
                        map[i][y] = (topRight + bottomRight + center) / 3+ displace(dimension);
                    }
                    
                    map[i][y] = normalize(map[i][y]);
                    
                    // Left
                    if(i - (newDimension * 2) + (newDimension / 2) > 0){
                        map[i - newDimension][y] = (topLeft + bottomLeft + center + map[i - dimension + (newDimension / 2)][y]) / 4 + displace(dimension);;
                    }else{
                        map[i - newDimension][y] = (topLeft + bottomLeft + center) / 3+ displace(dimension);
                    }
                    
                    map[i - newDimension][y] = normalize(map[i - newDimension][y]);
                }
            }
            midpointDisplacment(newDimension);
        }
    }

    // Normalize the value to make sure its within bounds
    function normalize(value){
        if( value > 1){
            value = 1;
        }else if(value < 0){
            value = 0;
        }
        return value;
    }

    // Random function to offset the center
    function displace(num){
        var max = num / (mapDimension + mapDimension) * roughness;
        return (self.random()- 0.5) * max;
    }


    startDisplacement();

    var max = 0;
    var min = 1;
    for (var px=1;px<mapDimension; px++) {
        for (var py=1;py<mapDimension; py++) {
            if (max < map[px][py]) max = map[px][py];
            if (min > map[px][py]) min = map[px][py];
        }
    }
    for (var px=0;px<=mapDimension; px++) {
        for (var py=0;py<=mapDimension; py++) {
            map[px][py] = (map[px][py]-min)/(max-min);
            if (map[px][py] > 1) map[px][py]=1;
        }
    }

    return map;
};

/* Perlin effects */

/**
 * spherization
 * @value:
 *  - noise {Array [x][y] or perlin}
 *  - ratio {int > float} is 0.4 by default
 *  - spherical {float} is 0.6 by default
 *  - x origin {Int} is center of the perlin by default
 *  - y origin {Int} is center of the perlin by default
 * @return:
 *  Array [x][y] with value between 0 and 1
 *
 */
Random.spherization = function spherization (perlin, ratio, spherical, x, y) {
    var ratio = ratio !== undefined ? ratio : 0.4;
    var spherical = spherical !== undefined ? spherical : 0.6;
    var width = perlin.length;
    var height = perlin[0].length;
    if (x == null) x = width/2 | 0;
    if (y == null) y = height/2 | 0;

    function distance(_x, _y) {
        var dx = x-_x,
            dy = y-_y;
        return Math.sqrt(dx*dx+dy*dy);
    }

    var dmax = Math.max(
        distance(0,0),
        distance(0,height),
        distance(width,0),
        distance(width,height)
    )*1.2;

    var min = 1;
    var max = 0;
    for (var px=0;px<width; px++) {
        for (var py=0;py<height; py++) {
            if (min > perlin[px][py]) min = perlin[px][py];
            if (max < perlin[px][py]) max = perlin[px][py];
        }
    }

    var newMap = [];
    var d;
    var mm = (max - min);
    var max = 0;
    for (var px=0;px<width; px++) {
        newMap[px] = [];
        for (var py=0;py<height; py++) {
            d = distance(px,py);
            newMap[px][py] = (perlin[px][py] - min) / mm;
            newMap[px][py] = newMap[px][py] * (0.5+Math.cos(2 * Math.PI * (dmax - d/2*spherical) / (dmax + d/2*spherical)))/1.5;
            if (max < newMap[px][py]) max = newMap[px][py];
        }
    }

    var ag = 0;
    var mg = 0;
    for (var px=0;px<width; px++) {
        for (var py=0;py<height; py++) {
            newMap[px][py] /= max;
            ag += newMap[px][py];
            mg += newMap[px][py]*newMap[px][py];
        }
    }

    mg = Math.sqrt(mg / (width*height));
    ag = ag / (width*height);
    var average = (ag*2+mg)/3;
    var depth = ratio*average*2;

    for (var px=0;px<width; px++) {
        for (var py=0;py<height; py++) {
            newMap[px][py] = newMap[px][py]-depth;
        }
    }

    return newMap;
};


/*
 * @return:
 *  Array of Objects {x, y}
 *
 */
Random.prototype.walk = function walk (length, amplitude, cubic) {
    var x=0;
    var y=0;
    var res = [x, y];
    amplitude = amplitude || 3;
    cubic = cubic || false;
    for (var i=0; i<length; i++) {
        var r=Math.floor(this.random()*4);
        var v=cubic ? amplitude : Math.floor(this.random()*amplitude)+1;
        if(r===0)      { x+=v; }
        else if(r===1) { y+=v; }
        else if(r===2) { x-=v; }
        else if(r===3) { y-=v; }
        res.push({x:x, y:y});
    }
    return res;
};
/*
 * @return:
 *  Array of Objects {x, y, z}
 *
 */
Random.prototype.walk3D = function walk3D (length, amplitude, cubic) {
    var x=0;
    var y=0;
    var z=0;
    var res = [x, y, z];
    amplitude = amplitude || 3;
    cubic = cubic || false;
    for (var i=0; i<length; i++) {
        var r=Math.floor(this.random()*6);
        var v=cubic ? amplitude : Math.floor(this.random()*amplitude)+1;
        if(r===0)      { x+=v; }
        else if(r===1) { y+=v; }
        else if(r===2) { z+=v; }
        else if(r===3) { x-=v; }
        else if(r===4) { y-=v; }
        else if(r===5) { z-=v; }
        res.push({x:x, y:y, z:z});
    }
    return res;
};
/*
 * non-uniform, favours points closer to the inner ring, leads to denser packings
 * @return:
 *  Object {x, y}
 */
Random.prototype.pointAround = function pointAround (point, radius) {
    var angle = 2 * Math.PI * this.random();
    radius = radius * this.random();
    return {
        x: Math.round(point.x + radius * Math.cos(angle)),
        y: Math.round(point.y + radius * Math.sin(angle))
    };
};
/*
 * non-uniform, favours points closer to the inner ring, leads to denser packings
 * @return:
 *  by default:
 *    Array of Array [x][y] with true value for each random points
 *  if return_points: 
 *    Array of Objects {x, y}
 */
Random.prototype.radius = function radius (width, height, radius, return_points) {
    var shape = width*height,
        density = 1/radius,
        nb = shape*density*density,
        cell = Math.floor( 1/density ),
        points = [],
        grid = [],
        point,
        i = 0;
    if (!cell) cell = 1;

    function addToGrid(point, grid) {
        if (!grid[point.x]) grid[point.x] = [];
        grid[point.x][point.y] = true;
    }
    function inNeighbourhood (point, radius, grid) {
        var r2 = radius*radius, dx, dy;
        for (var x = point.x-radius; x < point.x+radius; x++) {
            for (var y = point.y-radius; y < point.y+radius; y++) {
                dx = point.x-x;
                dy = point.y-y;
                if (grid[x] && grid[x][y] && (dx*dx+dy*dy) < r2) {
                    return true;
                }
            }
        }
        return false;
    }
    for (var y = Math.ceil(cell/2); y <= height; y += cell) {
        for (var x = i ? Math.ceil(cell/2) : 0; x <= width; x += cell) {
            point = this.randomPointAround({x:x, y:y}, radius);
            if (point &&
                point.x >= 0 && point.x <= width &&
                point.y >= 0 && point.y <= height &&
                !inNeighbourhood(point, radius/2, grid)) {
                addToGrid(point, grid);
                points.push(point);
            }
        }
        i++;
    }
    return return_points ? points : grid;
};
Random.prototype.twoD = function twoD (width, height, number) {
    var points = [];
    for (var i=0; i<number; i++) {
        points.push({
            x: Math.round(this.random()*width),
            y: Math.round(this.random()*height)
        });
    }
    return points;
};
/*
 * @return:
 *    Array of Objects {x, y, z}
 */
Random.prototype.threeD = function threeD (width, height, depth, number) {
    var points = [];
    for (var i=0; i<number; i++) {
        points.push({
            x: Math.round(this.random()*width),
            y: Math.round(this.random()*height),
            z: Math.round(this.random()*depth)
        });
    }
    return points;
};
/*
 * @value:
 *  - dices: {int} dice values
 *  - reroll: {int} dice values
 *    reroll if (int > 0 and value >= int) or (int < 0 and value <= -int)
 * @return:
 *  Array of random numbers
 *
 */
Random.prototype.dice = function dice (dice, reroll) {
    var res = [Math.round(this.range(1, dice))];
    if (reroll != null && ((reroll > 0 && res >= reroll) || (reroll < 0 && res <= -reroll))) {
        res = res.concat(this.dice(dice, reroll));
    }
    return res;
};
/*
 * @return:
 *  array value after Unsorted
 *
 */
Random.prototype.unsort = function unsort (array) {
    var self = this;
    array.sort(function (a, b) { return self.random()-0.5; });
    return array;
};

module.Random = Random;
if(typeof module.exports !== 'undefined') module.exports = Random;
})(typeof module === 'undefined' ? this : module);
