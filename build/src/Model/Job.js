"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DbConnection_1 = __importDefault(require("../DbConnection"));

class Job extends sequelize_1.Model {
  id;
  title;
  firstName;
  lastName;
  dateOfBirth;
  email;
  contactNumber;
  address;
  postcode;
  landlordName;
  landlordContactNumber;
  landlordEmail;
  agentName;
  agentContactNumber;
  agentEmail;
  heatingType;
  propertyType;
  epcRating;
  serviceType;
  assessmentDate;
  notes;
  user_id;
  month;
  year;
  status;
  rowNumber;
  epcBand;
  waterType;
}

Job.init(
  {
    id: {
      type: sequelize_1.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    contactNumber: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    postcode: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    landlordName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    landlordContactNumber: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    landlordEmail: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    agentName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    agentContactNumber: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    agentEmail: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    heatingType: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    propertyType: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    epcRating: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    serviceType: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    assessmentDate: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: sequelize_1.DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    month: {
      type: sequelize_1.DataTypes.TEXT,
      allowNull: false,
    },
    year: {
      type: sequelize_1.DataTypes.TEXT,
      allowNull: false,
    },
    rowNumber: {
      type: sequelize_1.DataTypes.NUMBER,
      allowNull: false,
    },
    epcBand: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    waterType: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: DbConnection_1.default,
    modelName: "Job",
    tableName: "employee_jobs",
    timestamps: false,
  },
);
exports.default = Job;
