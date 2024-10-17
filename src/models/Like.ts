import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db/config";
import User from "./User";
import Template from "./Template";


class Like extends Model<InferAttributes<Like>, InferCreationAttributes<Like>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare templateId: ForeignKey<Template['id']>;
}

Like.init({
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
}, {
  sequelize,
  tableName: "likes",
  timestamps: false,
})

Template.hasMany(Like, {foreignKey: 'templateId'});
Like.belongsTo(Template, {foreignKey: 'templateId'});

User.hasMany(Like, {foreignKey: 'userId'});
Like.belongsTo(User, {foreignKey: 'userId'});

export default Like;
