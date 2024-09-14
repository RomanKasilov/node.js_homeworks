const fs = require('node:fs/promises')
const path = require('node:path')

const baseFolderPath = path.join(__dirname, 'baseFolder')

const createFolders = async () => {
    try {
        await fs.mkdir(baseFolderPath, {recursive: true})
        let i = 1
        while (i <= 5) {
            const currentFolderPath = path.join(baseFolderPath, `folder${i}`)
            await fs.mkdir(currentFolderPath, {recursive: true})
            for (let x = 1; x <= 5; x++) {
                await fs.writeFile(path.join(currentFolderPath, `file${x}.txt`), 'Hello World')
            }
            i++;
        }
    } catch (e) {
        console.error(e.message)
    }
}
const readFolders = async () => {
    try {
        const data = await fs.readdir(baseFolderPath)
        await Promise.all(data.map(async (folder) => {
            const folderPath = path.join(baseFolderPath, folder)
            const folderStat = await fs.stat(folderPath)
            console.log(`${folderPath} isDirectory: ${folderStat.isDirectory()}`)

            const files = await fs.readdir(folderPath)
            await Promise.all(files.map(async (file) => {
                const filePath = path.join(folderPath, file)
                const fileStat = await fs.stat(filePath)
                console.log(`${filePath} isFile: ${fileStat.isFile()}`)
            }))
        }))
    } catch (e) {
        console.error(e.message)
    }
}
void createFolders()
void readFolders()