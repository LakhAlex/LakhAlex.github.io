const searchInput = document.getElementById("search-input");

const showSearchResult = () => {
    let searchWord = searchInput.value;

    // 1. 검색어를 안전하게 인코딩합니다.
    const encodedWord = encodeURIComponent(searchWord);
    
    // 2. window.location.href 대신 window.open을 사용해 새 탭으로 안전하게 엽니다.
    window.open(`https://www.google.com/search?q=${encodedWord}`, '_blank', 'noopener,noreferrer');
    searchWord = "";  
};

// const enterKey = (event) => {
//     if(event.code === "Enter"){
//         showSearchResult();
//     }
// };
function enterKey(event){
    if(event.code === "Enter"){
        showSearchResult();
    }
}

searchInput.addEventListener("keypress", (event) => {
    enterKey(event);
});
