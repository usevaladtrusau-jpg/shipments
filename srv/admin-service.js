const cds = require('@sap/cds')
const {generateCuid} = require('./utils/generateCuid')

cds.on('bootstrap', app => {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
  })
})

class AdminService extends cds.ApplicationService { init() {

  const { Orders } = this.entities

  this.before ('CREATE', Orders, async (req) => {
    if (req.data.ID) return;

    const { ID:id1 } = await SELECT.one.from(Orders).columns('max(ID) as ID')
    let cuid = req.data.cuid || null;
    let exists = null;

    do {
      cuid = generateCuid();
       exists = await SELECT(1).from(Orders).where({cuid});
       console.log('[POST]:', JSON.stringify(exists));
       
    } while (exists.length > 0)

    req.data.cuid = cuid;
    req.data.ID = Math.max(id1||0) + 1;
  })

  this.on('updateOrder', async  (req) => {
    const {cuid, data} = req.data;
    const order = await SELECT(1).from(Orders).where({cuid});

    if (!order?.length) req.error(404, 'Order not found');

    await UPDATE(Orders).set(data).where({cuid});
    
    req.reply({
    message: 'Order updated successfully',
    cuid});
  } )

  this.on('removeOrder', async (request) => {
    const {cuid} = request.data;
    
    const order = await SELECT(1).from(Orders).where({cuid});
    console.log(order)
    if (!order?.length) {
      request.error(404, 'Order not found');
    }

    await DELETE(Orders).where({cuid});

    request.reply({
      message: 'Order deleted successfully',
      cuid
    })
  })

  this.on('createDeal', async (request) => {
    const {data: properties} = request.data;
    const url = 'https://72d012dctrial.it-cpitrial05-rt.cfapps.us10-001.hana.ondemand.com/http/hubspot/deals';

    try {

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({properties}),
        headers: {
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJqaWQiOiJwcEZaQXdlakVVUlNjWE9tanZrZGp5RXYwTDNQbW5abU5nYVRPUW5pTlc4PSIsImFsZyI6IlJTMjU2Iiwiamt1IjoiaHR0cHM6Ly83MmQwMTJkY3RyaWFsLmF1dGhlbnRpY2F0aW9uLnVzMTAuaGFuYS5vbmRlbWFuZC5jb20vdG9rZW5fa2V5cyIsImtpZCI6ImRlZmF1bHQtand0LWtleS0yMGQyZWFjOTA3In0.eyJzdWIiOiJzYi05YmEwNTFlYS01ZjYzLTRmODktOThlOS02ZDZjYjY1ODcwYjkhYjY1MTYwMHxpdC1ydC03MmQwMTJkY3RyaWFsIWIyNjY1NSIsImlzcyI6Imh0dHBzOi8vNzJkMDEyZGN0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIiwiaXQtcnQtNzJkMDEyZGN0cmlhbCFiMjY2NTUuRVNCTWVzc2FnaW5nLnNlbmQiXSwiY2xpZW50X2lkIjoic2ItOWJhMDUxZWEtNWY2My00Zjg5LTk4ZTktNmQ2Y2I2NTg3MGI5IWI2NTE2MDB8aXQtcnQtNzJkMDEyZGN0cmlhbCFiMjY2NTUiLCJhdWQiOlsic2ItOWJhMDUxZWEtNWY2My00Zjg5LTk4ZTktNmQ2Y2I2NTg3MGI5IWI2NTE2MDB8aXQtcnQtNzJkMDEyZGN0cmlhbCFiMjY2NTUiLCJ1YWEiLCJpdC1ydC03MmQwMTJkY3RyaWFsIWIyNjY1NS5FU0JNZXNzYWdpbmciXSwiZXh0X2F0dHIiOnsiZW5oYW5jZXIiOiJYU1VBQSIsInN1YmFjY291bnRpZCI6ImZhOTM5OWRiLWE4ZGYtNDBjOC1hNWM5LTA1NDAwMzYwNWQxMCIsInpkbiI6IjcyZDAxMmRjdHJpYWwiLCJzZXJ2aWNlaW5zdGFuY2VpZCI6IjliYTA1MWVhLTVmNjMtNGY4OS05OGU5LTZkNmNiNjU4NzBiOSJ9LCJ6aWQiOiJmYTkzOTlkYi1hOGRmLTQwYzgtYTVjOS0wNTQwMDM2MDVkMTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwiYXpwIjoic2ItOWJhMDUxZWEtNWY2My00Zjg5LTk4ZTktNmQ2Y2I2NTg3MGI5IWI2NTE2MDB8aXQtcnQtNzJkMDEyZGN0cmlhbCFiMjY2NTUiLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiLCJpdC1ydC03MmQwMTJkY3RyaWFsIWIyNjY1NS5FU0JNZXNzYWdpbmcuc2VuZCJdLCJleHAiOjE3Nzk5NzY4NTUsImlhdCI6MTc3OTk3MzI1NSwianRpIjoiNTZjYzAyZjA0MjRkNDJhZjk2NWFiMzFhMTMyMTQzODAiLCJyZXZfc2lnIjoiNzQ0ODNhM2YiLCJjaWQiOiJzYi05YmEwNTFlYS01ZjYzLTRmODktOThlOS02ZDZjYjY1ODcwYjkhYjY1MTYwMHxpdC1ydC03MmQwMTJkY3RyaWFsIWIyNjY1NSJ9.Qc7CIeRshyWcWBJDWIPPW1cYTJrA3UZbNuBLYPzw_HkrsfV8yFT-wY0T3D4lHt2NUqzqLrVQHR4jBpjDQm6KZeFIcG4X8Pm_wltnKZ4jGj_DeaMktfkBxwcPTHCHaApd3zVYWQtb37lDFk4iSnu2toExHgleZDu9iNXPkt7z3bEnGV5W4Vh2yqpnx2SO9hiKXrqgnjlARvfSLEFHy_q76Y9ePysowFbQghydoVbkaDms0Vx862yCHrcttvxIQE0SuzRptEcfaMxvuaXwgzmi1PowRsezao2O3VEdPrWEOk6VLk6HCB-hvkae45KD6mnelwdQ2NclJYLbZFM-PZLzKg"
        }
      });

      if (!response.ok) {
        request.reject('500', 'Request to Integration Suite failed');
      }
      
      const result = await response.json();

 request.reply(result)
    } catch (error) {
      request.reject('500', 'Something went wrong', JSON.stringify(error));
    }
    
    


  })

  return super.init()
}}


module.exports = {AdminService}; 
