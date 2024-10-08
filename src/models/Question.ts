import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db/config";
import Template from "./Template";
import { QuestionTypes } from "../interfaces/template/question";


class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare visible: boolean;
  declare templateId: ForeignKey<Template['id']>;
  declare sequence: number;
  declare type: QuestionTypes;
}

Question.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sequence: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(QuestionTypes.MULTIPLE, QuestionTypes.BOOLEAN, QuestionTypes.TEXT, QuestionTypes.INTEGER),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "questions",
  timestamps: false,
})

export default Question;
