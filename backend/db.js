const iniparser = require("iniparser");
const config = iniparser.parseSync("./config.ini");
const sql = require("mssql");

var pool; //DB : bigData Pool

var config1 = {
  user: config.MSSQL.user,
  password: config.MSSQL.password,
  server: config.MSSQL.server,
  database: config.MSSQL.database,
  trustServerCertificate: true,
  requestTimeout: 300000,
};

pool = new sql.ConnectionPool(config1)
  .connect()
  .then((pool) => {
    console.log("DB 연결");
    return pool;
  })
  .catch((err) => {
    console.log("err : ", err);
  });

module.exports = {
  sql,
  pool,
};
