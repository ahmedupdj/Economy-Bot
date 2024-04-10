const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const table = new ascii("Events").setJustify();
module.exports = (client) => {
    readdirSync("./events").forEach(folder => {
        const eventFiles = readdirSync(`./events/${folder}`).filter(file => file.endsWith(`.js`));
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            if (event.name) {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                table.addRow(event.name, "✅  working");
            } else {
                table.addRow(file, "❌ Not working");
            }
        }
    });
    console.log(table.toString());
};
