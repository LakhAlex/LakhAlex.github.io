const API_URL = "https://random-quote.hyobb.com/";
const quoteElemnet = document.getElementById("quote");
// const quoteItem = localStorage.getItem("quote");

// 현재시간
const nowDate = new Date();
const month = nowDate.getMonth() + 1;
const date = nowDate.getDate();

const setQuote = (result) => {
    let quote = {createDate : `${month}-${date}`, quoteData : result};
    // localStorage.setItem("quote", JSON.stringify(quote));
    quoteElemnet.textContent = `"${result}"`;
};

const getQuote = async() => {
    try{
        const data = await fetch(API_URL).then((res) => res.json());
        // console.log(data);
        const result = data[1].respond;
        // console.log(result);
        setQuote(result);
    }
    catch(e){
        console.log(`Error : ${e}`);
        setQuote("Don't Think, Just Do!");
    }
};

// if (quoteItem) {
//     //localstorage에 quote가 있다면
//     let { createDate, quoteData } = JSON.parse(quoteItem);
//     if (createDate === `${month}-${date}`) {
//         quoteElemnet.textContent = `"${quoteData}"`;
//     } else {
//         getQuote();
//     }
// } else {
//     //localstorage에 quote가 없다면
//     getQuote();
// }

getQuote();