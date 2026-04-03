 const financialRecord = require("../Models/financialRecords.models");

async function createRecord(req,res){
    try {
        const {amount,type,category,date,notes} = req.body;
        const record = await financialRecord.create({
        user: req.user._id, // comes from protect middleware
        amount,
        type,
        category,
        date: date || Date.now(),
        notes,
        })

        res.status(201).json({
        message: 'Record created successfully',
        record,
    });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Server error"
        })
    }
}

async function getAllRecords(req,res){
    try {
     const filter = req.user.role === 'admin'? {} : { user: req.user._id };
    const records = await financialRecord.find(filter).populate('user', 'name email role').sort({date : -1});

    if(!records){
        return res.status(401).json({
            message : "No Records present"
        })
    }

    return res.status(200).json({
        message : "successfully fetched records",
        records
    })
      
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Server error",
        })
    }
}

async function getRecordById(req,res){
    try {
        const id = req.params.id;

        const record = await financialRecord.findById(id).populate('user', 'name email role');

        if(!record){
            return res.status(402).json({
                message : "record not found"
            })
        }

     if (req.user.role !== 'admin' && record.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json({
        message : "Record fetched successfully",
        record
    })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Server error",
        })
    }
}

 async function updateRecord(req, res) {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await financialRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // analyst only update their own records
    if (
      req.user.role === 'analyst' &&
      record.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'You can only update your own records' });
    }

    const updated = await financialRecord.findByIdAndUpdate(
      req.params.id,
      { amount, type, category, date, notes },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Record updated successfully',
      record: updated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

async function deleteRecord(req, res) {
  try {
    const record = await financialRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // soft delete —  isDeleted to true
    await financialRecord.findByIdAndUpdate(req.params.id, { isDeleted: true });

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error"});
  }
};

module.exports = {createRecord,getAllRecords,getRecordById,deleteRecord,updateRecord}