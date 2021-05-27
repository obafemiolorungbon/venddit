

const formatTime = ()=>{
    return new Promise((resolve,reject)=>{
        const date = new Date(Date.now());
        
        resolve({
        time: date.toTimeString(),
        day: date.toDateString(),
        });
    })
}

module.exports = formatTime