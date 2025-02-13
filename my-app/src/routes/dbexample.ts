import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { users } from "../../schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();
  console.log(result);// HTMLを生成
  let htmlContent = "<h1>Users List</h1>";
  htmlContent += "<table border='1'><tr><th>ID</th><th>Name</th><th>Age</th></tr>";

  // 取得した結果をHTMLテーブルに埋め込む
  result.forEach((user) => {
    htmlContent += `<tr><td>${user.id}</td><td>${user.name}</td><td>${user}</td></tr>`;
  });

  htmlContent += "</table>";

  // HTMLをレスポンスとして返す
  return c.html(htmlContent);
});

export default app;