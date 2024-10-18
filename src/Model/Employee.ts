import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../DbConnection";

// Define an interface for User attributes
interface UserAttributes {
  id: number;
  username: string;
  password: string;
  email: string;
  role: string;
  resetPasswordToken?: string | null; // Add the resetPasswordToken property
  resetPasswordExpires?: Date | null;
  googleTokens?: string;
  spreadsheetId?: string;
  link?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class Employee
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  // We don't declare fields here to avoid shadowing Sequelize's getters and setters
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public role!: string;
  public resetPasswordToken?: string | null;
  public resetPasswordExpires?: Date | null;
  public googleTokens?: string;
  public spreadsheetId?: string;
  public link?: string;

  public getId(): number {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public setUsername(value: string) {
    this.username = value;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(value: string) {
    this.password = value;
  }

  public getRole(): string {
    return this.role;
  }

  public setRole(value: string) {
    this.role = value;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(value: string) {
    this.email = value;
  }
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleTokens: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spreadsheetId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
    modelName: "Employee",
  },
);

export default Employee;
