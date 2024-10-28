"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DbConnection_1 = __importDefault(require("../DbConnection"));

class User extends sequelize_1.Model {
  // We don't declare fields here to avoid shadowing Sequelize's getters and setters
  id;
  username;
  password;
  email;
  role;
  googleTokens;

  getGoogleToken() {
    return this.googleTokens;
  }

  setGoogleToken(value) {
    this.googleTokens = value;
  }

  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  setUsername(value) {
    this.username = value;
  }

  getPassword() {
    return this.password;
  }

  setPassword(value) {
    this.password = value;
  }

  getRole() {
    return this.role;
  }

  setRole(value) {
    this.role = value;
  }

  getEmail() {
    return this.email;
  }

  setEmail(value) {
    this.email = value;
  }
}

User.init(
  {
    id: {
      type: sequelize_1.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    googleTokens: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: DbConnection_1.default,
    tableName: "users",
    timestamps: false,
  },
);
exports.default = User;
