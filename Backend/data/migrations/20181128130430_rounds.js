exports.up = function(knex, Promise) {
    return knex.schema.createTable("Rounds", function(table) {
        table.increments();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("Rounds");
};
