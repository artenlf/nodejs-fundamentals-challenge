import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const completed_at = req.body

      const existingTask = database.select('tasks', { id })[0]

      if (!existingTask) {
        return res.writeHead(404).end()
      }

      database.update('tasks', id, {
        title: existingTask.title,
        description: existingTask.description,
        completed_at: !existingTask.completed_at,
        created_at: existingTask.created_at,
        updated_at: existingTask.updated_at !== undefined ? existingTask.updated_at : null
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const existingTask = database.select('tasks', { id })[0]

      if (!existingTask) {
        return res.writeHead(404).end()
      }

      database.update('tasks', id, {
        title: title || existingTask.title,
        description: description || existingTask.description,
        completed_at: existingTask.completed_at,
        created_at: existingTask.created_at,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]