import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../db/config";
import Template from "./Template";
import User from "./User";
import Answer from "./Answer";


class Form extends Model<InferAttributes<Form>, InferCreationAttributes<Form>> {
  declare id: CreationOptional<number>;
  declare submissionDate: CreationOptional<Date>;
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
    allowNull: true,
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

Template.hasMany(Form, {foreignKey: 'templateId', onDelete: 'CASCADE'});
Form.belongsTo(Template, {foreignKey: 'templateId'});

Form.hasMany(Answer, {foreignKey: 'formId', onDelete: 'CASCADE'});
Answer.belongsTo(Form, {foreignKey: 'formId'});

User.hasMany(Form, {foreignKey: 'userId'});
Form.belongsTo(User, {foreignKey: 'userId'});

export default Form;
