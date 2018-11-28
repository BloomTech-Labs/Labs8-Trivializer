exports.up = function(knex, Promise) {
    return knex.schema.createTable("Questions", function(table) {
        table.increments();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("Questions");
};
