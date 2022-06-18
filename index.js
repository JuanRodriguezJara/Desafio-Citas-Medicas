// Importamos los módulos a utilizar
const http = require("http");
const url = require("url");
const fs = require("fs");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
moment.locale("es");
const _ = require("lodash");
const chalk = require("chalk");

// 1.- Consultar la Api https://randomuser.me/ usando método axios
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    if (req.url === "/favicon.ico") {
      res.end();
    }
    axios
      .get("https://randomuser.me/api/?results=10")
      .then((response) => {
        _.each(response.data.results, function (value, i) {
          const { first: nombre, last: apellido } = value.name;

          // 2.- Id único para cada usuario generado
          const id = uuidv4().slice(0, 6);

          // 3.- Fecha de registro de cada usuario generado
          const tiempo = moment().format("DD MMMM YYYY, h:mm:ss a");

          // 4.- Devolver al cliente una lista con los datos de los usuarios generados
          const datoUsuario = `${
            i + 1
          }.- Nombre: ${nombre} - Apellido: ${apellido} - ID: ${id} - Timestamp: ${tiempo}\n <br>`;

          res.write(datoUsuario);

          fs.appendFile(
            "./registro.txt",
            datoUsuario,
            { encoding: "utf-8", flag: "a" },
            (error) => {
              if (error) throw error;
            }
          );

          // 5.- Mostrar en Consola del servidor la lista de usuarios con fondo blanco y texto azul
          console.log(chalk.bgWhite.blue.bold(datoUsuario, "utf8"));
        });

        res.end();
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .listen(8080, () => console.log("Escuchando el puerto 8080"));
