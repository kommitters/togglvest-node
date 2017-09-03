import { prompt } from 'inquirer'

const questions = [
  {
    type: 'input',
    name: 'domain',
    message: 'Harvest domain:'
  },
  {
    type: 'input',
    name: 'email',
    message: 'Harvest email:'
  },
  {
    type: 'input',
    name: 'token',
    message: 'Toggl api token:'
  }
]

const saveConfig = answers => console.log(answers)

export default {
  setup: (program) =>
    program
      .command('configure')
      .alias('c')
      .description('Configure')
      .action(() => {
        prompt(questions).then(saveConfig)
      })
}
