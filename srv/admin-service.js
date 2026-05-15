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

  return super.init()
}}


module.exports = {AdminService}; 
