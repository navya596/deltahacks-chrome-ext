let oldDocument = null;
let contentScript = '';
let docDone = false;
let newLevel = 4; 



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
                { role: "user", content: question }, 
                { role: "system", content: `Answer the following question, keeping your answer below at most 80 words and as straightforward as you can given the following information ${contentScript}` } // Instruction to the assistant
            ]
        })
    });

    const data = await response.json();
    console.log(data.message.content[0].text);
    return data.message.content[0].text;
    
} 


async function scrapeData() {
    if (!docDone) {
        docDone = true;
        oldDocument = document.documentElement.innerHTML;
    }
    // Get the current active tab URL using Chrome's tabs API
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;

    
    
    // Fetch the page content
    const response = await fetch(url);
    const html = await response.text();

    console.log("URL:" + url);

    // Since we're in the extension context, we need to inject code into the tab
    // to access the page's DOM
    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: processPageContent,
        args: [newLevel] // Pass any necessary arguments
    });
}



// This function will be injected into the page context
function processPageContent(newLevel) {
    console.log("HERE!!");
    const paragraphs = document.querySelectorAll('p');
    contentScript = '';
    
    
    paragraphs.forEach(async function(paragraph) {
        console.log(paragraph.textContent);
        p = paragraph.innerText;
        contentScript = contentScript + p;








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
 
     let lvl = index;





        
        try {

            let  text = paragraph.innerText;
              let difficultyLevel = lvl; 








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
    const simplifiedText = data.message.content[0].text;






            console.log("Simplified Text: ", simplifiedText);
            paragraph.innerText = simplifiedText;
        } catch (error) {
            console.error("ERROR WITH DATA ", error);
        }
    });
}


window.onload = () => {
    const complexitySlider = document.getElementById("complexitySlider");
    complexitySlider.addEventListener("input", async (value) => {
        console.log("test: " + complexitySlider.value);
        if (complexitySlider.value == 1) {
            if (newLevel < complexitySlider.value) {
                return;
            }
            newLevel = 1;
            scrapeData();
        } else if (complexitySlider.value == 2) {
            if (newLevel < complexitySlider.value) {
                return;
            }
            newLevel = 4;
            scrapeData();
        } else if (complexitySlider.value == 3) {
            if (newLevel < complexitySlider.value) {
                return;
            }
            newLevel = 7;
            scrapeData();
        } else {

            // Reset the document back to its original state using scripting
            chrome.tabs.reload();
            newLevel = 16;

        }
    });
}

