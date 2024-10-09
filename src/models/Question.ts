import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db/config";
import Template from "./Template";
import { QuestionTypes } from "../interfaces/template/question";


class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
  declare id: CreationOptional<number>;
  declare title: CreationOptional<string>;
  declare description: CreationOptional<string>;
  declare visible: boolean;
  declare templateId: ForeignKey<Template['id']>;
  declare sequence: number;
  declare type: CreationOptional<QuestionTypes>;
}

Question.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sequence: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(QuestionTypes.MULTIPLE, QuestionTypes.BOOLEAN, QuestionTypes.TEXT, QuestionTypes.INTEGER),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: "questions",
  timestamps: false,
})

export default Question;
