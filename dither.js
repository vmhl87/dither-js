let i;

function setup(){
	createCanvas(0, 0);
	i = createFileInput((file) => {
		if(file.type != "image") return;
		createImg(file.data, "", "anonymous", (img) => {
			resizeCanvas(img.width, img.height);
			image(img, 0, 0, img.width, img.height);
			dither();
		}).hide();
		i.hide();
	}).position(10, 10);
	noLoop();
}

function dither(){
	loadPixels();
	for(let i=0; i<height; i++)
		for(let j=0; j<width; j++){
			tonalDitherPixel((i*width + j)*4, j, i);
		}
	updatePixels();
}

let ditherMap = [
	[0, 32, 8, 40, 2, 34, 10, 42],
	[48, 16, 56, 24, 50, 18, 58, 26],
	[12, 44, 4, 36, 14, 46, 6, 38],
	[60, 28, 52, 20, 62, 30, 54, 22],
	[3, 35, 11, 43, 1, 33, 9, 41],
	[51, 19, 59, 27, 49, 17, 57, 25],
	[15, 47, 7, 39, 13, 45, 5, 37],
	[63, 31, 55, 23, 61, 29, 53, 21]
]

/*
ditherMap = [
	[0, 5, 3],
	[7, 4, 6],
	[2, 8, 1]
]
*/

/*
let x=100;
let permutation=[], rand=[];
for(let i=0; i<x*x; i++) rand.push(i);
for(let i=0; i<x*x; i++){
	let j = Math.floor(Math.random()*rand.length);
	permutation.push(rand[j]);
	rand = [...rand.slice(0, j), ...rand.slice(j+1, rand.length)];
}
ditherMap = [];
for(let i=0; i<x; i++){
	ditherMap.push([]);
	for(let j=0; j<x; j++)
		ditherMap[i].push(permutation[i*x+j]);
}
*/

function compute(i, x, y){
	i = 4*255/16 + i*11/16;
	if(i*ditherMap.length*ditherMap[0].length/255 >
		ditherMap[x%ditherMap.length][y%ditherMap[0].length]) return 1;
	return 0;
}

function colorDitherPixel(i, x, y){
	for(let j=0; j<3; j++){
		pixels[i+j] = 255 * compute(pixels[i+j], x, y);
		x += 5; y += 2;
	}
}

function grayscaleDitherPixel(i, x, y){
	let avg = (pixels[i] + pixels[i+1] + pixels[i+2])/3;
	avg = 255 * compute(avg, x, y);
	for(let j=0; j<3; j++) pixels[i+j] = avg;
}

function tonalDitherPixel(i, x, y){
	let avg = (pixels[i] + pixels[i+1] + pixels[i+2])/3;
	avg = compute(avg, x, y);
	let undertone = [0, 0, 0.5],
		overtone = [1, 0.9, 0.9];
	for(let j=0; j<3; j++) pixels[i+j] = 255*(undertone[j]+avg*(overtone[j]-undertone[j]));
}
