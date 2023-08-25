const scoreKey = `moonrocks`;

const getHiScore = () => {
    let hiScore = localStorage.getItem(scoreKey);
    if(!hiScore){
        hiScore = 5000;
        localStorage.setItem(scoreKey, JSON.stringify(hiScore));
        return hiScore;
    } else {
        return JSON.parse(hiScore);
    }
}

const setHiScore = (score) => {
    localStorage.setItem(scoreKey, JSON.stringify(score));
}