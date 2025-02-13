import { Hono } from 'hono'
import mainPageRouter from './routes/mainpage'
//import mainPageRouter from './routes/dbexample';

const app = new Hono()

app.route('/', mainPageRouter);

export default app
