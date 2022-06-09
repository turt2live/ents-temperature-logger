const auth = require("./auth.json");
const amqplib = require('amqplib');
const fs = require("fs");

/*
auth.json:
{
    "mqConn": "amqp://guest:guest@localhost:5672"
    "mqQueue": "weather_data"
}
*/

const points = [];

(async () => {
  const queue = auth.mqQueue;
  const conn = await amqplib.connect(auth.mqConn);

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);

  // Listener
  ch1.consume(queue, (msg) => {
    if (msg !== null) {
      points.push(msg.content.toString());
      console.log('Recieved:', msg.content.toString());
      fs.writeFileSync("./dump.json", JSON.stringify(points, null, 2), "utf-8");
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();