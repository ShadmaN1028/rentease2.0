const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const port = process.env.PORT;
const app = express();

const tenantUsersRouter = require("./api/v1/tenant/users/routers/users");
const OwnerUsersRouter = require("./api/v1/owner/users/routers/users");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use("/api/v1/", tenantUsersRouter);
app.use("/api/v1/", OwnerUsersRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
