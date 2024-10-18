import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../DbConnection";

interface employeeJob {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  contactNumber: string;
  address: string;
  postcode: string;
  landlordName: string;
  landlordContactNumber: string;
  landlordEmail: string;
  agentName: string;
  agentContactNumber: string;
  agentEmail: string;
  heatingType: string;
  propertyType: string;
  epcRating: string;
  serviceType: string;
  assessmentDate: string;
  notes: string;
  user_id: number;
  month: string;
  year: string;
  status: string;
}

interface employeeJobsAttribute extends Optional<employeeJob, "id"> {}

class Job
  extends Model<employeeJob, employeeJobsAttribute>
  implements employeeJob
{
  public id!: number;
  public title!: string;
  public firstName!: string;
  public lastName!: string;
  public dateOfBirth!: string;
  public email!: string;
  public contactNumber!: string;
  public address!: string;
  public postcode!: string;
  public landlordName!: string;
  public landlordContactNumber!: string;
  public landlordEmail!: string;
  public agentName!: string;
  public agentContactNumber!: string;
  public agentEmail!: string;
  public heatingType!: string;
  public propertyType!: string;
  public epcRating!: string;
  public serviceType!: string;
  public assessmentDate!: string;
  public notes!: string;
  public user_id!: number;
  public month!: string;
  public year!: string;
  public status!: string;
}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landlordName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landlordContactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landlordEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agentName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agentContactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agentEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heatingType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    propertyType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    epcRating: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assessmentDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    month: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    year: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Job",
    tableName: "employee_jobs",
    timestamps: false,
  },
);

export default Job;
