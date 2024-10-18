import Employee from "./Employee";
import Job from "./Job";
import { Month } from "./Month";

Employee.hasMany(Job, {
  foreignKey: "user_id",
  as: "jobs",
  // Alias for the relationship
});
Job.belongsTo(Employee, {
  foreignKey: "user_id",
  as: "employee", // Alias for the inverse relationship
});

Month.hasMany(Job, {
  foreignKey: "month",
  sourceKey: "month_name",
  as: "jobs",
});

Job.belongsTo(Month, {
  foreignKey: "month",
  targetKey: "month_name",
  as: "monthDetail",
});

export { Employee, Job, Month };
