import {Request,Response,NextFunction} from "express"
import  dotenv  from 'dotenv';

dotenv.config()
interface IHaveRoom extends Request{
    roomId?:any
}
export default  function (req:IHaveRoom,res:Response,next:NextFunction){
    const id:any = req.header("roomId") 
    if (!id) return res.json({
        status:`Failed`,
        message:`Not Room Code`
    })
    try{
        req.roomId = id
        next()
    }catch(err){
        return res.status(403).json({error: "Failed"})
    }
}