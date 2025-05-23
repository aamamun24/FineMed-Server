import config from "./config";
import mongoose from 'mongoose'
import app from "./app";

async function main() {
    try{
        await mongoose.connect(config.database_url as string);
    
        app.listen(config.port, () => {
            console.log(`FineMed app listening on port ${config.port}`)
        })
    }catch(err){
        console.log(err)
    }

}

main();



