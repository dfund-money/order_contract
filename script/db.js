const mongoose = require('mongoose');
const cfg =  require('./config.js')



const orderSchema = new mongoose.Schema({
  key: {type: String,unique: true, index:true},
  user: {type: String,unique: false, index:false},
  fromToken: {type: String,unique: false, index:true},
  toToken: {type: String,unique: false, index:true},
  price: {type:Number,unique: false, index:true},
  amount: {type:String,unique: false, index:false},
  status: Number,  // 0: normal, ready.   1: waiting   2: invalid
});

const infoSchema = new mongoose.Schema({
  lastBlock: Number,
});
const Order = mongoose.model('Order', orderSchema);
const Info  = mongoose.model('Info', infoSchema)

class DbData {
  async  dbinit() {
    try {
      await mongoose.connect(cfg[cfg.network].dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true ,
        //autoReconnect: true,   // C, default is true, you can ignore it
        //poolSize: 5           // D, default is 5, you can ignore it
      });
      const db = mongoose.connection
      db.on('error', (error) => {
          console.log(`MongoDB connecting failed: ${error}`);
          process.exit(0);
      })
      db.once('open', () => {
          console.log('MongoDB connecting succeeded');
      })
    }catch(error){
      console.log(`MongoDB connecting failed: ${error}`);
      process.exit(0);
    }
  }
  async fetchRecord(fromToken, toToken, price) {
    let records = await Order.find({fromToken:fromToken, toToken:toToken, price: { $lt: price }, amount: {$gt:0}})
    return records
  }
  async getLastBlock() {
    let last = await Info.findOne()

    console.log("last:", last)
    if(!last) return 0
    return last.lastBlock
  }
  async saveLastBlock(n) {
    let last = await Info.findOne()
    if(!last) {
      await Info.create({lastBlock:n})
    }else{
      last.lastBlock = n
      await last.save()
    }
  }

  async saveRecords(records) {
    let option = {
      upsert:true
    }
    let rets = records.map(item=>{
      console.log("item:", item)
      return Order.findOneAndReplace({key:item.key},
        {
          key:item.key,
          user:item.user,
          fromToken:item.fromToken,
          toToken:item.toToken,
          price:item.price,
          amount:item.amount
        },option)
    })
    await Promise.all(rets)
  }

}
module.exports =  DbData











