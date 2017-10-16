import os from 'os'
import fs from 'fs'
import { sep } from 'path'
import { readFileSync, writeFile } from 'jsonfile'

const configFile = `${os.homedir()}${sep}.togglvest.json`

export const readConfig = () => fs.existsSync(configFile) ? readFileSync(configFile) : {}

export const saveConfig = (newConfig) => {
  return new Promise((resolve, reject) => {
    writeFile(configFile, newConfig, {spaces: 2}, (err) => {
      if (err) {
        console.log(`Something went wrong while saving the config in ${configFile}`)
        return reject(err)
      }

      console.log(`Configuration was saved in ${configFile}`)
      resolve(newConfig)
    })
  })
}
