import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db/config";
import Form from "./Form";
import Question from "./Question";


class Answer extends Model<InferAttributes<Answer>, InferCreationAttributes<Answer>> {
  declare id: CreationOptional<number>;
  declare formId: ForeignKey<Form['id']>;
  declare questionId: ForeignKey<Question['id']>;
  declare textValue: CreationOptional<string>;
  declare numberValue: CreationOptional<number>;
  declare booleanValue: CreationOptional<boolean>;
  declare multipleTextLineValue: CreationOptional<string>;
}

Answer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  formId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  textValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numberValue: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  booleanValue: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  multipleTextLineValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: "answers",
  timestamps: false,
})

Form.hasMany(Answer, {foreignKey: 'formId'});
Answer.belongsTo(Form, {foreignKey: 'formId'});

Question.hasMany(Answer, {foreignKey: 'questionId'});
Answer.belongsTo(Question, {foreignKey: 'questionId'});

export default Answer;
