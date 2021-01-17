$(document).ready(function() {
    const socket = io()

    socket.on("connect", () => {
        console.log("Conectado");
    })


    $(".tramo").on("click", function() {
        let id = this.id

        if ($(this).attr("disabled") != "disabled") {
            if ($(this).attr("active") == "true") {
                $(this).css({
                    background: "white"
                })
                $(this).attr({ "active": "false" })

                socket.emit("masUno", { id })
                socket.on("tramo", (data) => {
                    $(`#${data.tramo} .mc`).text(`Motociclistas disponibles ${data.mc}`)
                })

            } else {
                $(this).css({
                    background: "#84ffaf"
                })

                $(this).attr({ "active": "true" })

                socket.emit("menosUno", { id }, () => {
                    socket.on("tramo", (data) => {
                        if (data.mc == 0) {
                            $(this).attr('disabled', 'disabled')
                        }
                        $(this).removeAttr("disabled")
                        $(`#${data.tramo} .mc`).text(`Motociclistas disponibles ${data.mc}`)
                    })
                })
            }
        }

    })



    socket.on("tramos", (data) => {
        data.forEach(element => {
            if ($(`#${element.tramo}`).attr("active") != "true") {
                if (element.motociclistas == 0) {
                    $(`#${element.tramo}`).css({
                        background: "#ffd6d6",
                        cursor: "default"
                    }).attr('disabled', 'true')
                } else {
                    $(`#${element.tramo}`).css({
                        background: "white",
                        cursor: "pointer"
                    }).removeAttr('disabled')
                }
            }

            $(`#${element.tramo} .mc`).text(`Motociclistas disponibles ${element.motociclistas}`)
        });
    })



    socket.on('disconnect', function() {

        console.log('Perdimos conexión con el servidor');

    });


});