const {MongoClient} = require('mongodb').MongoClient;

require('dotenv')

async function main(){
    const uri = "mongodb+srv://ataakatranji:e4IsvR5AaA7PgAs5@ess.04gjwhn.mongodb.net/?retryWrites=true&w=majority&appName=ESS";

    const client = new MongoClient(uri);
    try {
        await client.connect();

        await listDataBase(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listDataBase(client){
   const dataBaseList = await client();
   console.log(`DataBase: \n ${dataBaseList}`);
   dataBaseList.forEach(db => {
    console.log(`- ${db.name}`);
   });

}

main().catch(console.error);