"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DbConnection_1 = __importDefault(require("../DbConnection"));
class Employee extends sequelize_1.Model {
    // We don't declare fields here to avoid shadowing Sequelize's getters and setters
    id;
    username;
    password;
    email;
    role;
    resetPasswordToken;
    resetPasswordExpires;
    googleTokens;
    spreadsheetId;
    dropboxAccessToken;
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
Employee.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
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
    resetPasswordExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    googleTokens: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    spreadsheetId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    dropboxAccessToken: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: DbConnection_1.default,
    tableName: "users",
    timestamps: false,
    modelName: "Employee",
});
exports.default = Employee;
