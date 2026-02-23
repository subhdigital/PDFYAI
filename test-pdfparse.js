const fs = require('fs');
fs.writeFileSync('test1.pdf', '%PDF-1.4\n1 0 obj <> endobj\ntrailer <</Root 1 0 R>>\n%%EOF');

async function run() {
    try {
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse();
        await parser.load(fs.readFileSync('test1.pdf'));
        const data = await parser.getText();
        console.log(data);
    } catch (e) {
        console.error(e.message);
    }
}
run();
