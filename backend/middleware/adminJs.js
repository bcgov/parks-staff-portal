import AdminJSExpress from "@adminjs/express";
import AdminJS from "adminjs";
import * as AdminJSSequelize from "@adminjs/sequelize";
import Connect from "connect-pg-simple";
import session from "express-session";

// our example sequelize model: "DB Row"
import DbRow from "../db/models/DbRow.js";
import {
  ParkOperator,
  User,
  Bundle,
  Park,
  Campground,
  CampsiteGrouping,
  Campsite,
  FeatureType,
  Season,
  ParkFeature,
  DateType,
  ParkDate,
  FeatureDate,
} from "../models/index.js";

import { connectionString } from "../db/connection.js";

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

// authenticate hardcoded credentials from environment variables
const DEFAULT_ADMIN = {
  email: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASSWORD,
};

async function authenticate(email, password) {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
}

const adminOptions = {
  // We pass Category to `resources`
  resources: [
    DbRow,
    Bundle,
    Park,
    ParkOperator,
    User,
    Campground,
    CampsiteGrouping,
    Campsite,
    FeatureType,
    Season,
    ParkFeature,
    DateType,
    ParkDate,
    FeatureDate,
  ],
};

// AdminJS plugin
export const admin = new AdminJS(adminOptions);

const ConnectSession = Connect(session);
const sessionStore = new ConnectSession({
  conObject: {
    connectionString,
    ssl: process.env.NODE_ENV === "production",
  },
  tableName: "session",
  createTableIfMissing: true,
});

export const sessionMiddleware = session({
  secret: process.env.ADMIN_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
});

export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate,
    cookieName: process.env.ADMIN_COOKIE_NAME,
    cookiePassword: process.env.ADMIN_COOKIE_PASSWORD,
  },
  null,
  {
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    secret: "sessionsecret",
    cookie: {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    },
    name: "adminjs",
  },
);

// https://docs.adminjs.co/installation/getting-started#frontend-bundling
// only affects production environment
admin.watch();
