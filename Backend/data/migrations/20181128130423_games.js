exports.up = function(knex, Promise) {
    return knex.schema.createTable("Games", function(table) {
        table.increments();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("Games");
};
