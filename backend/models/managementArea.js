import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class ManagementArea extends Model {
    // Helper method for defining associations.
    static associate(models) {
      ManagementArea.belongsTo(models.Section, {
        foreignKey: "sectionId",
        as: "section",
      });

      ManagementArea.hasMany(models.Park, {
        foreignKey: "managementAreaId",
        as: "parks",
      });
    }
  }

  ManagementArea.init(
    {
      strapiId: DataTypes.INTEGER, // `id` in strapi
      number: DataTypes.INTEGER, // `sectionNumber` in strapi
      name: DataTypes.STRING, // `sectionName` in strapi
      sectionId: DataTypes.INTEGER, // Foreign key to the Section model
    },
    {
      sequelize,
      modelName: "ManagementArea",
    },
  );

  return ManagementArea;
};
