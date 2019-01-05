const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const { readConfig } = require('./config')

const togglApiUrl = 'https://www.toggl.com/api/v8'
const { togglToken } = readConfig()

const b64Authorization = Buffer.from(`${togglToken}:api_token`).toString('base64')

const get = async (path, opts) => {
  const fetchOpts = {
    timeout: 10000,
    follow: 0,
    headers: {
      Authorization: `Basic ${b64Authorization}`,
      'Content-Type': 'application/json'
    },
    ...opts
  }

  const response = await fetch(`${togglApiUrl}${path}`, fetchOpts)
  const json = await response.json()
  return json
}

exports.getWorkspaces = async () => {
  return get('/workspaces')
}

exports.getTimeEntries = async (workspace, startDate, endDate) => {
  let projects = await get(`/workspaces/${workspace.id}/projects`)
  const clients = await get(`/workspaces/${workspace.id}/clients`)

  projects = projects.map((p) => {
    const client = clients.find((c) => c.id === p.cid)
    return { ...p, cname: client.name }
  })

  const params = new URLSearchParams()
  params.append('start_date', startDate)
  params.append('end_date', endDate)

  const timeEntries = await get(`/time_entries?${params.toString()}`)

  return timeEntries.map(({ id, pid, description, duration, tags = [] }) => {
    if (!pid) {
      throw new Error(`The time entry [${description}] has no project`)
    }

    const { name: projectName, cname } = projects.find((p) => p.id === pid)
    const decimalDuration = duration / 3600.0

    return {
      id,
      client: cname,
      project: projectName,
      description,
      tags: tags,
      duration: decimalDuration.toFixed(2)
    }
  })
}
