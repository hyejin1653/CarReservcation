const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { pool } = require("./db");

app.use(
  cors({
    origin: "*",
    header: "Access-Control-Allow-Origin : *",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get(`/getCarInfo`, async (req, res) => {
  const query = await pool;
  const request = await query.request();

  let sqls = `  select car_no from car_info `;
  request.query(sqls, (err, result) => {
    if (err) throw err;

    //console.log(result);
    res.send(result.recordset);
  });
});

app.get(`/getCarList`, async (req, res) => {
  const query = await pool;
  const request = await query.request();

  const from_dt = req.query.fromDt;
  const to_dt = req.query.toDt;

  let sqls = `  select	A.car_no, A.car_dept, A.car_type, B.car_user, B.from_dt, B.to_dt, B.dept, B.ALL_DAY, 
                        case	when b.all_day = 'Y' 
                            then convert(nvarchar(10), b.from_dt, 20) 
                            else convert(nvarchar(19), b.from_dt, 120) + '~' + convert(nvarchar(19), b.to_dt, 120) 
                        end as base_dt,
                        case when isnull(b.car_user, '') != '' then 'Y' else 'N' end as flag_eng,
                        case when isnull(b.car_user, '') != '' then '사용중' else '사용가능' end as flag
                from CAR_INFO A
                LEFT JOIN (		select a.*
                              from CAR_RESERV a
                              join (	select car_no, min(insert_dt) as insert_dt
                                  from CAR_RESERV
                                  where ('${from_dt}' <= convert(nvarchar(10), from_dt, 23) and '${to_dt}' >= convert(nvarchar(10), from_dt, 23)) 
                                  group by car_no
                                ) b on a.car_no = b.car_no and a.insert_dt = b.insert_dt 
                          ) B ON A.car_no = B.car_no
                where a.car_no like '${req.query.carNo}' + '%';
                
                
                select  car_no, car_user, convert(nvarchar(19), from_dt, 20) from_dt, convert(nvarchar(19), to_dt, 20) to_dt, dept, 
                        case when all_day = 'Y' 
                            then convert(nvarchar(19), from_dt, 20)
                            else convert(nvarchar(19), from_dt, 20) + '~' + convert(nvarchar(19), to_dt, 20) 
                        end as  baseDt  
                from CAR_RESERV
                where ('${from_dt}' <= convert(nvarchar(10), from_dt, 23) and '${to_dt}' >= convert(nvarchar(10), from_dt, 23)) 
                order by car_no, seq; `;
  request.query(sqls, (err, result) => {
    if (err) throw err;

    let resultData = result.recordsets[0];
    let resvArr = result.recordsets[1];

    let valueData = [];

    for (let row of resultData) {
      //console.log(row);
      let detail = resvArr.filter((item) => {
        return item.car_no == row.car_no;
      });

      row["detail"] = detail;
      valueData.push(row);
    }

    //console.log(result.recordsets[0].length, result.recordsets[1].length);
    res.send(valueData);
  });
});

app.post(`/setCarInfo`, async (req, res) => {
  const data = req.body;

  const query = await pool;
  const request = await query.request();

  let sqls = `  insert into CAR_RESERV values(
                  '${data.car_no}', (select count(seq) + 1 from CAR_RESERV where car_no = '${data.car_no}'),
                  '${data.user}', '${data.fromDt}', '${data.toDt}', '${data.dept}', '', getdate(), '${data.allDay}'
                )`;

  request.query(sqls, (err, result) => {
    if (err) throw err;

    res.status(200).send(200);
  });
});

app.get(`/getCarReservcation`, async (req, res) => {
  let fromDt = req.query.fromDt;
  let toDt = req.query.toDt;
  let carNo = req.query.carNo;

  console.log(req.query);

  const query = await pool;
  const request = await query.request();

  let sqls = `  SELECT CASE WHEN COUNT(*) = 1 THEN 'Y' ELSE 'N' END AS FLAG
                FROM CAR_RESERV
                WHERE ('${fromDt}' <= convert(nvarchar(10), from_dt, 23) and '${toDt}' >= convert(nvarchar(10), from_dt, 23))
                AND CAR_NO = '${carNo}' `;

  request.query(sqls, (err, result) => {
    if (err) throw err;

    console.log(result);
    res.status(200).send(result.recordset[0].FLAG);
  });
});

app.listen(5010, () => {
  console.log("start server http://localhost:" + 5010);
});
