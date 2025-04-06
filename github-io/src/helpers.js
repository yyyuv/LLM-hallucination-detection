const jStat = require('jstat');


const setTimeDelayForWords = (pHallucination) => {
    const intercept = 50;
    const slope = 200;
    const mean_token_rt=intercept+pHallucination*slope
    const sd_token_rt=0.6*mean_token_rt
    const scale = (Math.pow(sd_token_rt, 2)) / mean_token_rt;

    const shape = mean_token_rt / scale;
    return jStat.gamma.sample(shape, scale);
};

module.exports = setTimeDelayForWords;