const { prompt } = require('inquirer')
const moment = require('moment')
const { getTimeEntries, getWorkspaces } = require('../operations/toggl')
const { getTasks, createTimeEntry } = require('../operations/harvest')

const askForkWorkspace = async (workspaces) => {
  const choices = workspaces.map(w => w.name)
  const promptOptions = [{
    type: 'list',
    name: 'workspaceName',
    message: 'Choose a Toggl workspace:',
    choices
  }]

  const answer = await prompt(promptOptions)
  const workspace = workspaces.find(w => w.name === answer.workspaceName)

  return workspace
}

const sync = (command) => async (day = moment().date(), month, year = moment().year()) => {
  try {
    const workspaces = await getWorkspaces()
    let workspace

    if (workspaces.length > 1) {
      workspace = await askForkWorkspace(workspaces)
    } else {
      workspace = workspaces[0]
    }

    const monthIndex = month ? parseInt(month, 10) - 1 : moment().month()
    const date = moment({ year, month: monthIndex, day }).startOf('day')
    const startDate = date.format()
    const spentDate = command.spentDate ? moment(command.spentDate).format() : startDate
    const endDate = date.endOf('day').format()

    const timeEntries = await getTimeEntries(workspace, startDate, endDate)
    const harvestTasks = await getTasks()

    const harvestEntries = timeEntries.map(({ client, project, description, tags: [tag], duration }) => {
      const { id: taskId } = harvestTasks.find(t => t.name === tag)
      return {
        taskId,
        spentDate,
        hours: parseFloat(duration),
        notes: `[${client}/${project}] ${description}`
      }
    })

    let total = 0.00

    harvestEntries.forEach(({ notes, hours }) => {
      total += parseFloat(hours)
      console.log(`${notes} ${hours}`)
    })

    console.log(`Total hours ${total.toFixed(2)}`)

    const { confirm } = await prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure to insert these time entries for ${moment(startDate).format('YYYY-MM-DD')} into Harvest on ${moment(spentDate).format('YYYY-MM-DD')}?`
    }])

    if (confirm) {
      await Promise.all(harvestEntries.map(e => createTimeEntry(e)))
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = (program) => {
  const command = program.command('sync')
    .arguments('[day] [month] [year]')
    .option('-s, --spentDate <date>', 'Harvest spent date')
    .description('Sync toggl entries into harvest')

  return command.action(sync(command))
}
