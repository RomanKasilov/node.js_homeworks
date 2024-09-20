const fs = require('node:fs/promises')
const path = require('node:path')

const read = async ()=>{
    try {

        const pathToDB = path.join(__dirname, 'db.json')
        const data  =await fs.readFile(pathToDB, {encoding:'utf8'})
        return data? JSON.parse(data): []
    }catch (e) {
        console.log('Ошибка чтения файла', e.message);
    }
}

const write = async (data)=>{
    try {
        const pathToDB = path.join(__dirname, 'db.json')
        await fs.writeFile(pathToDB, JSON.stringify(data))
    }catch (e) {
        console.log('Ошибка записи файла', e.message);
    }
}
module.exports = {read, write}