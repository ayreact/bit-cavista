const fs = require('fs');
const buffer = fs.readFileSync('public/models/avatar.glb');
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16);
if (chunkType === 0x4E4F534A) {
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    fs.writeFileSync('nodes.txt', JSON.stringify(gltf.nodes.map(n => n?.name), null, 2));
}
