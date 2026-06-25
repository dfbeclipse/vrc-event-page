const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const castDir = path.join(__dirname, '../images/cast');
const outputDir = path.join(__dirname, '../images/DL');

async function convertCastImages() {
	// Create output directory if it doesn't exist
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const files = fs.readdirSync(castDir).filter(file => file.match(/\.(jpg|png)$/i));

	for (const file of files) {
		const match = file.match(/^([0-9]+)_(.+)\.(jpg|png)$/i);
		if (!match) continue;

		const number = match[1];
		const inputPath = path.join(castDir, file);
		const outputPath = path.join(outputDir, `${ number }.png`);

		try {
			await sharp(inputPath)
				.png()
				.toFile(outputPath);
			console.log(`Converted: ${ file } -> ${ number }.png`);
		} catch (error) {
			console.error(`Error converting ${ file }:`, error.message);
		}
	}

	console.log('All cast images converted to PNG');
}

convertCastImages().catch(error => {
	console.error('Conversion failed:', error);
	process.exit(1);
});
