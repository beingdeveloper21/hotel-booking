// GET /api/user

export const getUserData = async(req,res)=>{
    try{
       const role=req.user.role;
       const recentSerchedCities=req.user.recentSerchedCities;
       res.json({success:true,role,recentSerchedCities})
    }
    catch(error){
       res.json({success:false,message:error.message})
    }
}
//Store recentsearched Citites
export const storeRecentSerchedCities=async(req,res)=>{
    try{
    const {recentSerchedCity}=req.body
    const user = await req.user;
    if(user.recentSerchedCities.length  < 3){
        user.recentSerchedCities.push(recentSerchedCity)
    }
    else{
        user.recentSerchedCities.shift();
        user.recentSerchedCities.push(recentSerchedCity)
    }
    await user.save();
    res.json({success:true,message:"City added"})
    }
    catch(error){
          res.json({success:false,message:error.message})
    }
}

