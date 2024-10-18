import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "months",
  timestamps: false,
})
export class Month extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  month_name!: string;
}
