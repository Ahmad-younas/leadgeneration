"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Month = exports.Job = exports.Employee = void 0;
const Employee_1 = __importDefault(require("./Employee"));
exports.Employee = Employee_1.default;
const Job_1 = __importDefault(require("./Job"));
exports.Job = Job_1.default;
const Month_1 = require("./Month");
Object.defineProperty(exports, "Month", {
  enumerable: true,
  get: function () {
    return Month_1.Month;
  },
});
Employee_1.default.hasMany(Job_1.default, {
  foreignKey: "user_id",
  as: "jobs",
  // Alias for the relationship
});
Job_1.default.belongsTo(Employee_1.default, {
  foreignKey: "user_id",
  as: "employee", // Alias for the inverse relationship
});
Month_1.Month.hasMany(Job_1.default, {
  foreignKey: "month",
  sourceKey: "month_name",
  as: "jobs",
});
Job_1.default.belongsTo(Month_1.Month, {
  foreignKey: "month",
  targetKey: "month_name",
  as: "monthDetail",
});
