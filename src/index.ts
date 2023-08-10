import "reflect-metadata";
import { Database } from "./main/database/database.connection";
import { Server } from "./main/server/express.server";
import { CacheDatabase } from "./main/database/cache.connection";

// AGUARDA TUDO SE RESOLVER
Promise.all([Database.connect(), CacheDatabase.connect()]).then(() => {
    Server.listen();
    console.log("Feito");
});

// Database.connect().then(() => {
//     console.log("Database is connected");
//     Server.listen();
// });
