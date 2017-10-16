import dotenv from 'dotenv'
import { prompt } from 'inquirer'
import { saveConfig } from '../operations/config'
import { reloadConfig, getProjects } from '../operations/harvest'

dotenv.config()

const {
  HARVEST_CLIENT_ID,
  HARVEST_API_TOKEN,
  TOGGL_API_TOKEN
} = process.env

const questions = [
  {
    type: 'input',
    name: 'harvestClientId',
    message: 'Harvest Client ID:',
    default: HARVEST_CLIENT_ID
  },
  {
    type: 'input',
    name: 'harvestToken',
    message: 'Harvest API Token:',
    default: HARVEST_API_TOKEN
  },
  {
    type: 'input',
    name: 'togglToken',
    message: 'Toggl API Token:',
    default: TOGGL_API_TOKEN
  }
]

const askForProject = async(projects) => {
  const choices = projects.map(p => p.name)
  const promptOptions = [{
    type: 'list',
    name: 'projectName',
    message: 'Harvest project to be synchronized',
    choices
  }]

  const answer = await prompt(promptOptions)
  const project = projects.find(w => w.name === answer.projectName)

  return project
}

export default (program) => {
  program.command('config')
  .description('Config')
  .action(() => {
    prompt(questions)
    .then(async (config) => {
      await saveConfig(config)
      reloadConfig()
      const projects = await getProjects()
      const { id, name } = await askForProject(projects)
      await saveConfig({...config, harvestProjectId: id, harvestProjectName: name})
    })
    .catch(err => console.log(err))
  })
}
