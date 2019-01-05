const os = require('os')
const fs = require('fs')
const { sep } = require('path')
const { readFileSync, writeFile } = require('jsonfile')

const configFile = `${os.homedir()}${sep}.togglvest.json`

exports.readConfig = () => fs.existsSync(configFile) ? readFileSync(configFile) : {}

exports.saveConfig = (newConfig) => {
  return new Promise((resolve, reject) => {
    writeFile(configFile, newConfig, { spaces: 2 }, (err) => {
      if (err) {
        console.log(`Something went wrong while saving the config in ${configFile}`)
        return reject(err)
      }

      console.log(`Configuration was saved in ${configFile}`)
      resolve(newConfig)
    })
  })
}
