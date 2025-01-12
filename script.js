 /*
    const { CohereClientV2 } = require('cohere-ai');

    const cohere = new CohereClientV2({
    token: '<<apiKey>>',
    });

    (async () => {
    const response = await cohere.chat({
        model: 'command-r-plus',
        messages: [
        {
            role: 'user',
            content: 'hello world!',
        },
        ],
    });

    console.log(response);
    })();
    */

async function answerQuestion(question) {

    const apiKey = "Cfo9vnvLxJxeECFKIMVgqcmNJhiWwBDqBnsbhruV";
    const endpoint = "https://api.cohere.com/v2/chat";

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "command-r-plus", 
            messages: [
                { role: "user", content: text }, 
                { role: "system", content: `Answer the following question, keeping your answer as str` } // Instruction to the assistant
            ]
        })
    });

    const data = await response.json();
    console.log(data.message.content[0].text);
    return data.message.content[0].text;
    
} 

async function simplifyText(text, difficultyLevel, newLevel) {

    const apiKey = "Cfo9vnvLxJxeECFKIMVgqcmNJhiWwBDqBnsbhruV";
    const endpoint = "https://api.cohere.com/v2/chat";

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "command-r-plus", 
            messages: [
                { role: "user", content: text }, 
                { role: "system", content: `The following text is at a difficulty level of ${difficultyLevel} on the coleman liau index on a 16 point scale. Convert it to ${newLevel} on the scale and preserve the length.` } // Instruction to the assistant
            ]
        })
    });

    const data = await response.json();
    console.log(data.message.content[0].text);
    return data.message.content[0].text;
}

simplifyText("hello my name is wania and tell me all about climate change")
.then(simplifiedText => {
    console.log("Simplified Text: ", simplifiedText);
}).catch(error => {
    console.error("ERROR WITH DATA ", error);
})

async function scrapeData(){
    
    const url = window.location.href
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const document = parser.parserFromString(html, "text/html");

    const webTitle = document.querySelectorAll('h1');
    webTitle.forEach(function(title) {
        console.log(title.textContent);
    });
    
    const headers = document.querySelectorAll('h2,h3,h4,h5,h6');
    headers.forEach(function(header){
        console.log(header.textContent);
    });

    let p = ""
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(function(paragraph){
        console.log(paragraph.textContent);
        p += paragraph.textContent + ' '
    });

}

async function ColemanLiauIndex (p){

    let totalSentences = 0;
    let totalWords = 0;
    let totalLetters = 0;

    /*Counting Sentences*/
    const sentenceArray = p.split(/[.!?]/);

    sentenceArray.forEach(sentence => {
        if(sentence.trim().length > 0){
            totalSentences ++;
        }
    });

    /*Counting Words*/
    const wordsArray = p.split(/\s+/);

    wordsArray.forEach(word => {
        if(word.trim().length > 0){
            totalWords++;
        }
    });

    /*Counting Letters*/
    const lettersArray = p.match(/[a-zA-Z]/g);

    lettersArray.forEach(letter =>{
        if(lettersArray){
            totalLetters = lettersArray.length;
        }
    });


     // Calculate L and S - for calculation 
     let L = (totalLetters / totalWords) * 100;
     let S = (totalSentences / totalWords) * 100;
 
     // Compute the Coleman-Liau index
     let index = Math.round(0.0588 * L - 0.296 * S - 15.8);
 
     // Categorize the difficulty based on the index
     if (index >= 10) {
         console.log("Hard");
     } else if (index < 4) {
         console.log("Easy");
     } else {
         console.log("Medium");
     }
 
     return index;

}