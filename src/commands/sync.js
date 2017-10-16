import { prompt } from 'inquirer'
import moment from 'moment'
import { getTimeEntries, getWorkspaces } from '../operations/toggl'
import { getTasks, createTimeEntry } from '../operations/harvest'

const askForkWorkspace = async(workspaces) => {
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

const sync = async (day = moment().date(), month = moment().month(), year = moment().year()) => {
  try {
    const workspaces = await getWorkspaces()
    let workspace

    if (workspaces.length > 1) {
      workspace = await askForkWorkspace(workspaces)
    } else {
      workspace = workspaces[0]
    }

    const date = moment({year, month, day}).startOf('day')
    const startDate = date.format()
    const endDate = date.endOf('day').format()
    const timeEntries = await getTimeEntries(workspace, startDate, endDate)
    const harvestTasks = await getTasks()

    const harvestEntries = timeEntries.map(({client, project, description, tags: [tag], duration}) => {
      const { id: taskId } = harvestTasks.find(t => t.name === tag)
      return {
        taskId,
        spentDate: startDate,
        hours: parseFloat(duration),
        notes: `[${client}/${project}] ${description}`
      }
    })

    let total = 0.00

    harvestEntries.forEach(({notes, hours}) => {
      total += parseFloat(hours)
      console.log(`${notes} ${hours}`)
    })

    console.log(`Total hours ${total.toFixed(2)}`)

    const { confirm } = await prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure to sync the last Toggl Entries?'
    }])

    if (confirm) {
      await Promise.all(harvestEntries.map(e => createTimeEntry(e)))
    }
  } catch (e) {
    console.log(e)
  }
}

export default (program) =>
  program
  .command('sync')
  .arguments('[day] [month] [year]')
  .description('Sync toggl entries into harvest')
  .action(sync)
