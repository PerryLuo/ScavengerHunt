## Setting up your PostgreSQL database locally

### Create database first -- 2 ways:
In shell: `createdb scavenger_development`

In psql: `CREATE DATABASE scavenger_development;`

### Create user "accelerate" with password "password"
In shell: `psql -U accelerate -w -h 127.0.0.1 scavenger_development`

In psql: `CREATE USER accelerate WITH PASSWORD 'password' SUPERUSER;`

### Now do your first migration + seeding (in shell, in the root directory of the project)
```
sequelize db:migrate
sequelize db:seed:all
```

### NOTE: If you change the seed data, make sure to undo and then redo the migration again, otherwise the primary keys will not restart from 1
```
sequelize db:seed:undo:all
sequelize db:migrate:undo:all
sequelize db:migrate
```
