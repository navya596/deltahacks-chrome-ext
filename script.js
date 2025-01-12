
let newLevel = 2; 
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

async function scrapeData() {
    
    const url = window.location.href;
    const response = await fetch(url);
    const html = await response.text();


    console.log("URL:" + url);

    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach(function(paragraph){
        console.log(paragraph.textContent);
        let lvl = ColemanLiauIndex(paragraph.innerText);
        simplifyText(paragraph.innerText, lvl, newLevel) //replace new level with what the user has actually entered before -- user info
        .then(simplifiedText => {
            console.log("Simplified Text: ", simplifiedText);
            paragraph.innerText = simplifiedText;
            //here replace document element text with simplifiedText
        }).catch(error => {
            console.error("ERROR WITH DATA ", error);
        });


    });

}

async function ColemanLiauIndex (p){

    console.log("P IS: ", p);

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

     console.log(L)
     console.log(S)
     console.log(index)

     console.log("Index: ", index);
 
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

window.onload = () => {
    const complexitySlider = document.getElementById("complexitySlider");
    complexitySlider.addEventListener("input", (value) => {
        console.log("test: " + complexitySlider.value);
        scrapeData();
    });
}