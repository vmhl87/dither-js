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
	[0, 11, 3, 8],
	[15, 4, 12, 7],
	[2, 9, 1, 10],
	[13, 6, 14, 5]
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
	i = 255/ditherMap.length/ditherMap[0].length +
		i*(ditherMap.length*ditherMap[0].length-2)/
		(ditherMap.length*ditherMap[0].length);
	if(i*ditherMap.length*ditherMap[0].length/255 >
		ditherMap[x%ditherMap.length][y%ditherMap[0].length]) return 255;
	return 0;
}

function colorDitherPixel(i, x, y){
	for(let j=0; j<3; j++){
		pixels[i+j] = compute(pixels[i+j], x, y);
		x += 37; y += 97;
	}
}

function grayscaleDitherPixel(i, x, y){
	let avg = (pixels[i] + pixels[i+1] + pixels[i+2])/3;
	avg = compute(avg, x, y);
	for(let j=0; j<3; j++) pixels[i+j] = avg;
}

function tonalDitherPixel(i, x, y){
	let avg = (pixels[i] + pixels[i+1] + pixels[i+2])/3;
	avg = compute(avg, x, y);
	let undertone = [0.1, 0.1, 0.3],
		overtone = [1, 0.95, 0.95];
	for(let j=0; j<3; j++) pixels[i+j] = 255*(undertone[j]+avg/255*(overtone[j]-undertone[j]));
}
