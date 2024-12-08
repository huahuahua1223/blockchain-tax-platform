const db = require('../db');

async function saveBlock(block) {
    const query = `
        INSERT INTO blocks (number, hash, parentHash, nonce, stateRoot, miner, difficulty, extraData, gasLimit, gasUsed, timestamp, transactions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        block.number,
        block.hash,
        block.parentHash,
        block.nonce,
        block.stateRoot,
        block.miner,
        block.difficulty,
        block.extraData,
        block.gasLimit,
        block.gasUsed,
        block.timestamp,
        JSON.stringify(block.transactions)
    ];

    // 打印 values 数组中的所有值
    console.log('Block values to be saved:', values);

    try {
        const [result] = await db.execute(query, values);
        console.log(`Block ${block.number} saved to database.`);
    } catch (error) {
        console.error('Error saving block to database:', error);
    }
}

async function getAllBlocks() {
    const query = 'SELECT * FROM blocks ORDER BY number DESC';

    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching blocks:', error);
        throw error;
    }
}

module.exports = { saveBlock, getAllBlocks };
