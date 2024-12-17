import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class ManagementArea extends Model {
    // Helper method for defining associations.
    // This method is not a part of Sequelize lifecycle.
    // The `models/index` file will call this method automatically.
    static associate(models) {
      ManagementArea.belongsTo(models.Section, {
        foreignKey: "sectionId",
        as: "section",
      });
    }
  }

  ManagementArea.init(
    {
      strapiId: DataTypes.INTEGER, // `id` in strapi
      number: DataTypes.INTEGER, // `sectionNumber` in strapi
      name: DataTypes.STRING, // `sectionName` in strapi
      strapiUpdated: DataTypes.DATE, // `updatedAt` in strapi
      sectionId: DataTypes.INTEGER, // Foreign key to the Section model
    },
    {
      sequelize,
      modelName: "ManagementArea",
    },
  );

  return ManagementArea;
};
