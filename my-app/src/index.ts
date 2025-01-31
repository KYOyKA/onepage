import { Hono } from 'hono'
import mainPageRouter from './routes/mainpage'

const app = new Hono()

app.route('/', mainPageRouter);

export default app
