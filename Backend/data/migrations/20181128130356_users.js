exports.up = function(knex, Promise) {
    return knex.schema.createTable("Users", function(table) {
        table.increments();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("Users");
};
