import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db/config";
import User from "./User";
import Template from "./Template";


class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare templateId: ForeignKey<Template['id']>;
  declare content: string;
}

Comment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "comments",
  timestamps: true,
})

Template.hasMany(Comment, {foreignKey: 'templateId', onDelete: 'CASCADE'});
Comment.belongsTo(Template, {foreignKey: 'templateId'});

User.hasMany(Comment, {foreignKey: 'userId'});
Comment.belongsTo(User, {foreignKey: 'userId'});

export default Comment;
