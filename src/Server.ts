import express, { Express } from "express"
import cors from "cors"
import sequalize from "./db/config"
import authRouter from "./routes/authRoutes"
import { ApiPaths } from "./interfaces/utils"
import { notFound } from "./controllers/404"


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
      })
      .catch((error) => {
        console.error("[db]: Unable to synchronize the database:", error);
      });
  }

  middlwares() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  routes() {
    this.app.use(`${this.basePath}${this.paths.auth}`, authRouter)
    this.app.get('*', notFound)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`[server]: Server is running at port ${this.port}`)
    })
  }
}
