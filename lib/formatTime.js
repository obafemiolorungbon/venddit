/** formats date time as strings
 * @param { Date } date a date object  
 * @returns string formatted date and time
 */

const formatTime = ( date ) =>{
    return new Promise((resolve,reject)=>{
        try{
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