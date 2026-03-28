const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      field: 'company_id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      field: 'parent_id'
    },
    categoryType: {
      type: DataTypes.ENUM('raw_material', 'finished_good', 'consumable'),
      allowNull: false,
      field: 'category_type'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['company_id']
      },
      {
        fields: ['parent_id']
      },
      {
        fields: ['category_type']
      },
      {
        fields: ['name']
      }
    ]
  });

  // Instance methods
  Category.prototype.isRootCategory = function() {
    return this.parentId === null;
  };

  Category.prototype.getFullPath = async function() {
    const path = [this.name];
    let current = this;
    
    while (current.parentId) {
      const parent = await Category.findByPk(current.parentId);
      if (!parent) break;
      path.unshift(parent.name);
      current = parent;
    }
    
    return path.join(' > ');
  };

  // Class methods
  Category.findRootCategories = function(companyId) {
    return this.findAll({
      where: { 
        parentId: null,
        companyId 
      }
    });
  };

  Category.findByType = function(categoryType, companyId) {
    return this.findAll({
      where: { 
        categoryType,
        companyId 
      }
    });
  };

  Category.getCategoryTree = function(companyId) {
    return this.findAll({
      where: { companyId },
      order: [['name', 'ASC']]
    });
  };

  // Associations
  Category.associate = function(models) {
    // Category belongs to Company
    Category.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });

    // Category belongs to Parent Category
    Category.belongsTo(models.Category, {
      foreignKey: 'parentId',
      as: 'parent'
    });

    // Category has many Child Categories
    Category.hasMany(models.Category, {
      foreignKey: 'parentId',
      as: 'children'
    });

    // Category has many Products
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products'
    });
  };

  return Category;
};
