//get the required details
const fs = require('node:fs')
const pdfMake = require('pdfmake/build/pdfmake')
const pdfFonts = require('pdfmake/build/vfs_fonts')
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const api_key = process.env.api_key;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(api_key);

let prompt = "So I have had a hit and run case in USA , I have the video on my dashcam and I am aware of the number plate of this person ,which laws in USA are relevant to this case, and keep the answer precise";
let prompt2 = "";

function makePdf(data, i){
    
    const docDefinition = {
        content: [
          {
            text: `${data}`,
            style: 'customStyle',
            alignment: 'center',
          },
        ],
        styles: {
          customStyle: {
            fontSize: 12,
            italics: true,
          },
        },
    };
      
    // Create and download the PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    pdfDoc.getBuffer((buffer) => {
        // Save the buffer as a PDF file
        fs.writeFileSync(`document${i}.pdf`, buffer);
    });
      
}

async function run() {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    const result = await model.generateContent([prompt]);
    //the response is available in result.response.text()
    console.log(result.response.text());

    prompt2 = result.response.text() +", in the above text , please only list the article names and relevant sections and dont put any other text."
    const result2 = await model.generateContent([prompt2]);
    console.log(result2.response.text());

    makePdf(result.response.text(), 0);
    makePdf(result2.response.text(), 1);

}

run();



