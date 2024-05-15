const { spawn } = require('child_process');
const fs = require('fs');

// Replace with your video file path
const videoPath = '1.mp4';

// Output directory for generated images (create if it doesn't exist)
const outputDir = 'screenshots';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to generate a filename based on timestamp
function generateFilename(timestamp) {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toISOString().replace(/:\d+\.\d+Z$/, '').replace(/T/, '_');
    return `${formattedDate}.jpg`;
}


w = 1560 // get width of video
h = 1080// get height of video

const resolution = 480

ratio = resolution / h // calculate scale ratio for the resolution

wP = w * ratio // new width for selected resolution
hP = h * ratio // new height for selected resolution

const s = ((wP).toFixed(0) + ":" + hP) // creating scale string to pass in FFMPEG

// Spawn ffmpeg process
const ffmpeg = spawn('ffmpeg', [
    '-i', videoPath, // Input video file
    '-vf', 'fps=fps=1/1',// Set frame rate to capture 1 image every 1 seconds,
    '-q:v', '2', // Quality
    '-s', s, // set width & height
    `${outputDir}/${generateFilename(Math.floor(Date.now() / 1000))}_%d.jpg`, // Output filename based on timestamp
]);


// // Handle ffmpeg output and errors
ffmpeg.stdout.on('data', (data) => {
    console.log(`ffmpeg output: ${data}`);
});

ffmpeg.stderr.on('end', (data) => {
    console.error(`FFmpeg end: ${data} `);
});

ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data} `);
});

ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code} `);
});
