const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const port = process.env.PORT;
const app = express();

const tenantUsersRouter = require("./api/v1/tenant/users/routers/users");
const ownerUsersRouter = require("./api/v1/owner/users/routers/users");
const ownerBuildingsRouter = require("./api/v1/owner/buildings/routers/owner-buildings");
const ownerFlatsRouter = require("./api/v1/owner/flats/routers/owner-flats");
const ownerDashboardRouter = require("./api/v1/owner/dashboard/routers/owner-dashboard");
const tenantDashboardRouter = require("./api/v1/tenant/dashboard/routers/tenant-dashboard");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use("/api/v1/", tenantUsersRouter);
app.use("/api/v1/", ownerUsersRouter);
app.use("/api/v1/", ownerBuildingsRouter);
app.use("/api/v1/", ownerFlatsRouter);
app.use("/api/v1/", ownerDashboardRouter);
app.use("/api/v1/", tenantDashboardRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
