const axios = require('axios');
const _ = require('lodash');

const calculatePerimeter = (width, height) => {
    return 2 * (width + height);
};

const processImages = async (imageUrl) => {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const randomSleep = _.random(0.1, 0.4, true);
        await new Promise(resolve => setTimeout(resolve, randomSleep * 1000));
    } catch (error) {
        throw new Error("Image processing failed");
    }
};

module.exports = { calculatePerimeter, processImages };
