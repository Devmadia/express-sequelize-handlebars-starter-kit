// Example schema using bcrypt to hash and validate password.  checkPassword function will be called from login route
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class Example extends Model {
	checkPassword(loginPw) {
		return bcrypt.compareSync(loginPw, this.password);
	}
}

Example.init(
	{
		id       : {
			type          : DataTypes.INTEGER,
			allowNull     : false,
			primaryKey    : true,
			autoIncrement : true
		},

		username : {
			type      : DataTypes.STRING,
			allowNull : false
		},
		email    : {
			type      : DataTypes.STRING,
			allowNull : false,
			unique    : true,
			validate  : {
				isEmail : true
			}
		},
		password : {
			type      : DataTypes.STRING,
			allowNull : false,
			validate  : {
				len : [ 4 ]
			}
		}
	},
	{
		hooks           : {
			async beforeCreate(newExampleData) {
				newExampleData.password = await bcrypt.hash(newExampleData.password, 10);
				return newExampleData;
			},

			async beforeUpdate(updatedExampleData) {
				updatedExampleData.password = await bcrypt.hash(
					updatedExampleData.password,
					10
				);
				return updatedExampleData;
			}
		},
		sequelize,
		timestamps      : false,
		freezeTableName : true,
		underscored     : true,
		modelName       : 'example'
	}
);

module.exports = Example;
