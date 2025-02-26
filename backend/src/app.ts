import dotenv from 'dotenv';
dotenv.config();
import initApp from "./server";

const port = process.env.PORT || 3000;


console.log("1");
initApp().then((app) => {
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
});