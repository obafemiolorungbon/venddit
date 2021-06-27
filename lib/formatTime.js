const formatTime = () =>{
    return new Promise((resolve,reject)=>{
        try{
            const date = new Date(Date.now());
            resolve({
                time: date.toTimeString(),
                day: date.toDateString(),
            });
        }catch(err){
            reject(err)
        }     
    })
}

module.exports = formatTime