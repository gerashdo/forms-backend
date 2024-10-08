import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from '../db/config';
import Topic from "./Topic";
import Tag from "./Tag";
import User from "./User";
import Question from "./Question";


class Template extends Model<InferAttributes<Template>, InferCreationAttributes<Template>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare title: string;
  declare description: string;
  declare topicId: ForeignKey<Topic['id']>;
  declare image: CreationOptional<string>;
  declare isPublic: boolean;
}

Template.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  tableName: "templates",
});

User.hasMany(Template, {foreignKey: 'userId'});
Template.belongsTo(User, {foreignKey: 'userId'});

Topic.hasMany(Template, {foreignKey: 'topicId'});
Template.belongsTo(Topic, {foreignKey: 'topicId'});

Template.belongsToMany(Tag, {through: 'TemplateTag'});
Tag.belongsToMany(Template, {through: 'TemplateTag'});

Template.hasMany(Question, {foreignKey: 'templateId'});
Question.belongsTo(Template, {foreignKey: 'templateId'});

export default Template;
