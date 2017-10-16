import fetch from 'node-fetch'
import FormData from 'form-data'
import { readConfig } from './config'

const harvestApiUrl = 'https://api.harvestapp.com/v2'

let { harvestToken, harvestClientId, harvestProjectId } = readConfig()

const defaultFetchOpts = () => ({
  timeout: 10000,
  follow: 0,
  headers: {
    Authorization: `Bearer ${harvestToken}`,
    'Harvest-Account-ID': harvestClientId,
    'User-Agent': 'TogglVest-Node'
  }
})

export const reloadConfig = () => {
  const config = readConfig()
  harvestToken = config.harvestToken
  harvestClientId = config.harvestClientId
  harvestProjectId = config.harvestProjectId
}

const get = async (path, opts) => {
  const fetchOpts = {
    ...defaultFetchOpts(),
    ...opts
  }

  const response = await fetch(`${harvestApiUrl}${path}`, fetchOpts)
  const json = await response.json()
  return json
}

const post = async (path, body, opts) => {
  const fetchOpts = {
    method: 'POST',
    ...defaultFetchOpts(),
    body,
    ...opts
  }

  const response = await fetch(`${harvestApiUrl}${path}`, fetchOpts)
  const json = await response.json()
  return json
}

export const getProjects = async () => {
  const { projects } = await get('/projects')
  return projects
}

export const getTasks = async () => {
  const { task_assignments: taskAssignments } = await get(`/projects/${harvestProjectId}/task_assignments`)
  return taskAssignments.map(({ task: { id, name } }) => ({ id, name }))
}

export const createTimeEntry = async ({
 taskId,
 spentDate,
 hours,
 notes
}) => {
  const form = new FormData()
  form.append('project_id', harvestProjectId)
  form.append('task_id', taskId)
  form.append('spent_date', spentDate)
  form.append('hours', hours)
  form.append('notes', notes)

  return post('/time_entries', form)
}
