const app = require("../app");
const AppError = require("./../utils/appError");

exports.getOne = Model => async(req,res,next) => {
    try{
        let query = Model.findById(req.params.id);
        const doc = await query;

        if(!doc){
            return next(new AppError('No document with that id', 404));
        }
        res.status(200).json({
            status: 'success',
            data:doc
        });
        
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};//exports.getOne

exports.deleteOne = Model => async(req,res,next) => {
    try{
        const doc = await Model.findByIdAndDelete(req.params.id);

        if(!doc){
            return next(new AppError('No document with that id found', 404));
        }

        res.status(200).json({
            status: 'success',
            data:null
        });
        if(res.data.status === 'success'){
            window.setTimeout(()=> {
                location.assign('/');
            },1500);
        }
    }//try

    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};//exports.deleteOne

exports.updateOne = Model => async(req,res,next) => {
    try{
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });

        if(!doc){
            return next(new AppError('No document with that id found', 404));
        }

        res.status(200).json({
            status: 'success',
            data:doc
        });
        //("Review has been updated");
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};//exports.updateOne


exports.createOne = Model => async(req,res,next) => {
        try{
            //console.log('review');
            const doc = await Model.create(req.body);
            res.status(200).json({
                status: 'success',
                data:{
                    data:doc
                }
            });
    
        }
        catch(err){
            res.status(404).json({
                status: 'fail',
                message:'Review error'
            });
        }
};//exports.createOne
