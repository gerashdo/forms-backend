import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db/config";
import Template from "./Template";
import User from "./User";


class Form extends Model<InferAttributes<Form>, InferCreationAttributes<Form>> {
  declare id: CreationOptional<number>;
  declare submissionDate: Date;
  declare templateId: ForeignKey<Template['id']>;
  declare userId: ForeignKey<User['id']>;
}

Form.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  submissionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "forms",
  timestamps: false,
})

Template.hasMany(Form, {foreignKey: 'templateId'});
Form.belongsTo(Template, {foreignKey: 'templateId'});

User.hasMany(Form, {foreignKey: 'userId'});
Form.belongsTo(User, {foreignKey: 'userId'});

export default Form;
