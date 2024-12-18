import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Park extends Model {
    // Helper method for defining associations.
    // This method is not a part of Sequelize lifecycle.
    // The `models/index` file will call this method automatically.
    // @param models
    static associate(models) {
      // define association here
      Park.belongsTo(models.Dateable, {
        foreignKey: "dateableId",
        as: "dateable",
      });
      Park.hasMany(models.Feature, {
        foreignKey: "parkId",
        as: "features",
      });
      Park.hasMany(models.Campground, {
        foreignKey: "parkId",
        as: "campgrounds",
      });
      Park.hasMany(models.Season, {
        foreignKey: "parkId",
        as: "seasons",
      });
    }
  }
  Park.init(
    {
      name: DataTypes.STRING,
      orcs: DataTypes.STRING,
      dateableId: DataTypes.INTEGER,
      strapiId: DataTypes.INTEGER,
      managementAreaStrapiIds: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "Park",
    },
  );
  return Park;
};
