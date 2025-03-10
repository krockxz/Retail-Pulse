const fs = require('fs-extra');
const { STORE_MASTER_PATH } = require('../config');

const getStoreMaster = async (filePath) => {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    const stores = lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const [area_code, store_name, store_id] = line.split(',');
        return { 
            store_id: store_id.trim(), 
            store_name: store_name.trim(),
            area_code: area_code.trim()
        };
    });

    return stores;
};


module.exports = { getStoreMaster };
