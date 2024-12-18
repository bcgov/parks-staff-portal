/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Sections table
    await queryInterface.createTable("Sections", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      strapiId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create ManagementAreas table
    await queryInterface.createTable("ManagementAreas", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      sectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Sections",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      strapiId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add managementAreaId to Parks table
    await queryInterface.addColumn("Parks", "managementAreaId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "ManagementAreas",
        key: "id",
      },
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert changes in the down function
    await queryInterface.removeColumn("Parks", "managementAreaId");
    await queryInterface.dropTable("ManagementAreas");
    await queryInterface.dropTable("Sections");
  },
};
