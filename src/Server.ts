import express, { Express } from "express"
import cors from "cors"
import sequalize from "./db/config"
import authRouter from "./routes/authRoutes"
import templateRouter from "./routes/templateRoutes"
import topicRouter from "./routes/topicRoutes"
import tagRouter from "./routes/tagRoutes"
import questionRouter from "./routes/questionRoutes"
import { ApiPaths } from "./interfaces/utils"
import { notFound } from "./controllers/404"
import { createBaseTopics } from "./scripts/topics"
import { createBaseUsers } from "./scripts/users"
import { createBaseTemplate } from "./scripts/templates"
import { createBaseTags } from "./scripts/tags"


export class Server {
  private app: Express
  private port: number
  private paths: ApiPaths
  private basePath: string

  constructor() {
    this.basePath = "/api/v1"
    this.port = parseInt(process.env.PORT)
    this.app = express()
    this.paths = {
      auth: "/auth",
      templates: "/templates",
      tags: "/tags",
      topics: "/topics",
      questions: "/questions",
    }
    this.connectDB()
    this.syncDB()
    this.middlwares()
    this.routes()
  }

  connectDB() {
    try {
      sequalize.authenticate()
      console.log("[db]: Database connected")
    } catch (error) {
      console.error("[db]: Unable to connect to the database:", error)
    }
  }

  syncDB() {
    sequalize.sync({ force: false })
      .then(() => {
        console.log("[db]: Database synchronized");
        this.runScripts()
      })
      .catch((error) => {
        console.error("[db]: Unable to synchronize the database:", error);
      });
  }

  async runScripts() {
    if (process.env.NODE_ENV !== 'development') return
    await createBaseTopics()
    await createBaseTags()
    await createBaseUsers()
    await createBaseTemplate()
  }

  middlwares() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  routes() {
    this.app.use(`${this.basePath}${this.paths.auth}`, authRouter)
    this.app.use(`${this.basePath}${this.paths.templates}`, templateRouter)
    this.app.use(`${this.basePath}${this.paths.topics}`, topicRouter)
    this.app.use(`${this.basePath}${this.paths.tags}`, tagRouter)
    this.app.use(`${this.basePath}${this.paths.questions}`, questionRouter)
    this.app.get('*', notFound)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`[server]: Server is running at port ${this.port}`)
    })
  }
}
