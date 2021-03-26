exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'bobby', password: '1234' },
        { username: 'Robby', password: '1234' },
        { username: 'Hobby', password: '1234' },
      ]);
    });
};
