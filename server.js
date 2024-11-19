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
const tenantApplicationsRouter = require("./api/v1/tenant/applications/routers/tenant-applications");
const ownerApplicationsRouter = require("./api/v1/owner/applications/routers/owner-applications");
const tenantTenancyRouter = require("./api/v1/tenant/tenancy/routers/tenant-tenancy");
const tenantRequestsRouter = require("./api/v1/tenant/service_requests/routers/tenant_service");
const ownerRequestsRouter = require("./api/v1/owner/service_requests/routers/owner-service");
const ownerPaymentsRouter = require("./api/v1/owner/payments/routers/owner-payments");
const ownerNotificationsRouter = require("./api/v1/owner/notifications/routers/owner-notifications");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use("/api/v1/", tenantUsersRouter);
app.use("/api/v1/", ownerUsersRouter);
app.use("/api/v1/", ownerBuildingsRouter);
app.use("/api/v1/", ownerFlatsRouter);
app.use("/api/v1/", ownerDashboardRouter);
app.use("/api/v1/", tenantDashboardRouter);
app.use("/api/v1/", tenantApplicationsRouter);
app.use("/api/v1/", ownerApplicationsRouter);
app.use("/api/v1/", tenantTenancyRouter);
app.use("/api/v1/", tenantRequestsRouter);
app.use("/api/v1/", ownerRequestsRouter);
app.use("/api/v1/", ownerPaymentsRouter);
app.use("/api/v1/", ownerNotificationsRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
