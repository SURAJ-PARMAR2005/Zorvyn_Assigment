const financialRecords = require("../Models/financialRecords.models");

async function getSummary(req,res){
   try {
     const id = req.user.id;

    const records = await financialRecords.find({
       user :id,isDeleted:false
    });

    let income = 0;
    let expense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    records.forEach((record) => {
        if(record.type === "income"){
            income += record.amount;
            incomeCount++;
        }
        else{
            expense += record.amount;
            expenseCount++;
        }
    })

    const netBalance  = income - expense;

    return res.status(200).json({
      summary: {
        income,
        expense,
        incomeCount,
        expenseCount,
        netBalance
      }
    });


   } catch (error) {
    console.log(error);
    return res.status(500).json({
        message : "Server error"
    })
   }    
}

 async function getCategoryTotal(req, res){
  try {
    const id = req.user.id;
    const records = await financialRecords.find({
      user : id,
      isDeleted: false
    });

    const map = {};

    records.forEach((record) => {
      const key = `${record.category}-${record.type}`;

      if (!map[key]) {
        map[key] = {
          category: record.category,
          type: record.type,
          total: 0,
          count: 0
        };
      }

      map[key].total += record.amount;
      map[key].count++;
    });

    const result = Object.values(map).sort((a, b) => b.total - a.total);

    return res.status(200).json({
      count: result.length,
      categories: result
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({message : "Server Error" });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const id = req.user.id;

    const months = parseInt(req.params.months) || 6; //by default 6 months data will be fethced
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const records = await financialRecords.find({
     user : id,
      isDeleted: false,
      date: { $gte: startDate }
    });

    const map = {};

    records.forEach((r) => {
      const date = new Date(r.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const key = `${year}-${month}-${r.type}`;

      if (!map[key]) {
        map[key] = {
          year,
          month,
          type: r.type,
          total: 0,
          count: 0
        };
      }

      map[key].total += r.amount;
      map[key].count++;
    });

    const result = Object.values(map).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return res.status(200).json({
      period: `Last ${months} months`,
      trends: result
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message:"Server errror" });
  }
};

const getWeeklyTrends = async (req, res) => {
  try {
   const id = req.user.id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const records = await financialRecords.find({
      user : id,
      isDeleted: false,
      date: { $gte: startDate }
    });

    const map = {};

    records.forEach((r) => {
      const date = new Date(r.date);
      const day = date.getDay() + 1; // 1–7

      const key = `${day}-${r.type}`;

      if (!map[key]) {
        map[key] = {
          dayOfWeek: day,
          type: r.type,
          total: 0,
          count: 0
        };
      }

      map[key].total += r.amount;
      map[key].count++;
    });

    const dayNames = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const trends = Object.values(map)
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      .map((item) => ({
        ...item,
        day: dayNames[item.dayOfWeek]
      }));

    return res.status(200).json({
      period: "Last 7 days",
      trends
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error"});
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const id = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const records = await financialRecords.find({
       user : id,
      isDeleted: false
    }).sort({ createdAt: -1 }) .limit(limit);

    res.json({
      count: records.length,
      records
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {getSummary,getCategoryTotal,getMonthlyTrends,getWeeklyTrends,getRecentActivity}