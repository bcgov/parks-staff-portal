import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Section extends Model {
    // Helper method for defining associations.
    // This method is not a part of Sequelize lifecycle.
    // The `models/index` file will call this method automatically.
    static associate(models) {
      Section.hasMany(models.ManagementArea, {
        foreignKey: "sectionId",
        as: "managementAreas",
      });
    }
  }

  Section.init(
    {
      strapiId: DataTypes.INTEGER, // `id` in strapi
      number: DataTypes.INTEGER, // `sectionNumber` in strapi
      name: DataTypes.STRING, // `sectionName` in strapi
    },
    {
      sequelize,
      modelName: "Section",
    },
  );

  return Section;
};
