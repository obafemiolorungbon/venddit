
function addTwoNums(numOne,numTwo,numThree) {
    console.log(numOne+numTwo+numThree)
    return
}

function runnerCatch ( func, numOne, numTwo, numThree) {
    try {
        func(numOne,numTwo,numThree)
    }catch(err){
        console.log("An error Happened");
    }
}

runnerCatch(addTwoNums,3,4,5)


/**
 * takes in a function reference, returns a function that runs the input 
 * function with parameters inside a try catch block 
 * @param { Function } funcToRun the function to run 
 * @returns 
 */
const asyncHandler = ( funcToRun ) =>{
    return (numOne,numTwo) => {
        try{
            funcToRun(numOne,numTwo)
        }catch(err)
        {
            console.log("An error happened");
            console.log(err.message);
        }
    }
}


const sumOfTwo = asyncHandler( (numOne,numTwo)=>{
    console.log(numOne+numTwo)
    throw new Error("Sum function threw error intentionally");
})

// sumOfTwo(5,5)