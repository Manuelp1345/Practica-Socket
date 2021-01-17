const { io } = require('../main');
const mongoose = require("mongoose");
const tramos = require('../models/tramos');

const configdb = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

mongoose.connect('mongodb+srv://tramos:17c5baEG0XN9lla4@tramos.mu1my.mongodb.net/tramos?retryWrites=true&w=majority', configdb, (err, res) => {
    if (err) throw err
    console.log("base de datos ONLINE");
});

io.on('connection', (client) => {

    console.log("conectado")


    function obtenerTramos() {
        tramos.find((err, tramosDB) => {
            client.broadcast.emit("tramos", tramosDB)
        })
    }

    obtenerTramos()



    client.on("menosUno", async(data) => {
        let tramosDB = await tramos.findOne({ tramo: data.id })

        if ((tramosDB.motociclistas <= 8) && (tramosDB.motociclistas > 0)) {
            tramosDB.motociclistas -= 1
            await tramos.updateOne({ tramo: data.id }, { motociclistas: tramosDB.motociclistas })
            client.emit("tramo", { tramo: tramosDB.tramo, mc: tramosDB.motociclistas })
            obtenerTramos()

        }

    })

    client.on("masUno", async(data) => {
        let tramosDB = await tramos.findOne({ tramo: data.id })

        if ((tramosDB.motociclistas >= 0) && (tramosDB.motociclistas < 8)) {
            tramosDB.motociclistas += 1
            await tramos.updateOne({ tramo: data.id }, { motociclistas: tramosDB.motociclistas })

            client.emit("tramo", { tramo: tramosDB.tramo, mc: tramosDB.motociclistas })
            obtenerTramos()
        }

    })

    client.on("disconnect", async() => {
        await tramos.find((err, tramosDB) => {
            tramosDB.forEach(element => {
                if (element.motociclistas != 8) {
                    element.motociclistas += 1
                    tramos.updateOne({ tramo: element.tramo }, { motociclistas: element.motociclistas }).exec()
                    obtenerTramos()
                }
            })
        })
    })

});