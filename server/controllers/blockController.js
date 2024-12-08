const { ethers } = require('ethers');
const { saveBlock, getAllBlocks } = require('../models/block');

// const provider = new ethers.JsonRpcProvider('http://localhost:8888');
const provider = new ethers.JsonRpcProvider('http://123.207.53.145:5002');

async function startBlockListener() {
    provider.on('block', async (blockNumber) => {
        try {
            console.log('New block received:', blockNumber);
            const block = await provider.getBlock(blockNumber,true);
            console.log('block===:',block);

            await saveBlock(block);
        } catch (error) {
            console.error('Error processing block:', error);
        }
    });
}

async function getBlocks(req, res) {
    try {
        const blocks = await getAllBlocks();
        res.json(blocks);
    } catch (error) {
        console.error('Error fetching blocks:', error);
        res.status(500).json({ error: 'Error fetching blocks' });
    }
}

module.exports = { startBlockListener, getBlocks };
