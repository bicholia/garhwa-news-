const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        const filePath = path.join(__dirname, 'public', 'og-image.png');
        const buffer = fs.readFileSync(filePath);

        const blob = new Blob([buffer], { type: 'image/png' });

        const formData = new FormData();
        formData.append('file', blob, 'og-image.png');

        console.log('Sending request to local API...');
        const res = await fetch('http://localhost:3000/api/admin/media/upload', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        console.log('Response Status:', res.status);
        console.log('Response JSON:', data);
    } catch (err) {
        console.error('Test error:', err);
    }
}

testUpload();
