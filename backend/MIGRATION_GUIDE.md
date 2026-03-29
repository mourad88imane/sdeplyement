# SQLite to PostgreSQL Migration Guide

This guide will help you migrate your Django application data from SQLite to PostgreSQL.

## Prerequisites

- PostgreSQL 15 installed via Homebrew
- Python 3 with Django installed
- Existing SQLite database (`db.sqlite3`)

## Current Status

✅ PostgreSQL installed and running
✅ SQLite database exists with data
⚠️ PostgreSQL user needs to be set up correctly

## Step-by-Step Migration Process

### Step 1: Fix PostgreSQL User Setup

The issue you encountered is that PostgreSQL converts unquoted identifiers to lowercase. Run the setup script:

```bash
cd backend
chmod +x setup_postgres.sh
./setup_postgres.sh
```

This script will:
- Check if PostgreSQL is running
- Drop any existing users (to fix case sensitivity issues)
- Create user `venduser` (lowercase) with password `mouraD&88`
- Create database `venddb`
- Grant all necessary privileges
- Test the connection

### Step 2: Verify PostgreSQL Connection

Test that Django can connect to PostgreSQL:

```bash
python3 manage.py check --database default
```

If this succeeds, you're ready to migrate!

### Step 3: Migrate Your Data

Run the migration script:

```bash
python3 migrate_to_postgres.py
```

This script will:
1. Export all data from SQLite to JSON format
2. Set up PostgreSQL database schema (run migrations)
3. Import all data into PostgreSQL
4. Create a backup of the exported data

**What to expect:**
- The script will ask for confirmation before proceeding
- It will show progress for each step
- A backup file `data_export_backup.json` will be created
- The process should take a few seconds to a minute depending on data size

### Step 4: Verify the Migration

After migration, verify your data:

```bash
# Start Django shell
python3 manage.py shell

# Check some data
>>> from django.contrib.auth.models import User
>>> User.objects.count()
>>> # Should show the number of users from your SQLite database

>>> from users.models import UserProfile
>>> UserProfile.objects.count()
>>> # Check other models as needed

>>> exit()
```

### Step 5: Start Your Server

If everything looks good, start your Django server:

```bash
python3 manage.py runserver
```

Your application should now be running with PostgreSQL!

## Troubleshooting

### Issue: "role 'venduser' does not exist"

**Solution:** PostgreSQL is case-sensitive with quoted identifiers. Run:

```bash
psql postgres -c "DROP USER IF EXISTS venduser, vendUser, \"vendUser\";"
psql postgres -c "CREATE USER venduser WITH PASSWORD 'mouraD&88' CREATEDB SUPERUSER;"
```

### Issue: "database 'venddb' does not exist"

**Solution:** Create the database:

```bash
psql postgres -c "CREATE DATABASE venddb OWNER venduser;"
```

### Issue: "connection refused"

**Solution:** Start PostgreSQL:

```bash
brew services start postgresql@15
# Wait a few seconds
pg_isready  # Should return "accepting connections"
```

### Issue: Migration script fails during import

**Solution:** This can happen if there are data conflicts. You can:

1. Check the error message for specific issues
2. Manually review `data_export_backup.json`
3. Try importing specific apps:
   ```bash
   python3 manage.py loaddata data_export_backup.json --app users
   python3 manage.py loaddata data_export_backup.json --app reviews
   # etc.
   ```

## Manual Migration (Alternative Method)

If the automated script doesn't work, you can migrate manually:

### 1. Export from SQLite

```bash
# Temporarily modify settings to use SQLite
python3 manage.py dumpdata \
  --natural-foreign \
  --natural-primary \
  --indent 2 \
  --exclude contenttypes \
  --exclude auth.permission \
  --exclude sessions.session \
  --exclude admin.logentry \
  --output data_export.json \
  --settings=school_backend.settings_sqlite_temp
```

### 2. Setup PostgreSQL

```bash
# Run migrations
python3 manage.py migrate --run-syncdb
```

### 3. Import to PostgreSQL

```bash
# Load data
python3 manage.py loaddata data_export.json
```

## Database Configuration

Your current PostgreSQL configuration (in `settings.py`):

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'venddb',
        'USER': 'venduser',
        'PASSWORD': 'mouraD&88',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## After Successful Migration

Once you've verified everything works:

1. **Backup your SQLite database** (just in case):
   ```bash
   cp db.sqlite3 db.sqlite3.backup
   ```

2. **Keep the export backup** for a while:
   - `data_export_backup.json` contains all your data
   - You can delete it after a few days of successful operation

3. **Update your deployment**:
   - Make sure your production environment uses PostgreSQL
   - Update environment variables if needed

## Rollback (If Needed)

If something goes wrong and you need to go back to SQLite:

1. Stop your Django server
2. Modify `settings.py` to use SQLite:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.sqlite3',
           'NAME': BASE_DIR / 'db.sqlite3',
       }
   }
   ```
3. Restart your server

## Support

If you encounter issues not covered here:

1. Check Django logs for specific error messages
2. Check PostgreSQL logs: `tail -f /opt/homebrew/var/log/postgresql@15.log`
3. Verify PostgreSQL is running: `pg_isready`
4. Test database connection: `psql -U venduser -d venddb`

## Files Created

- `setup_postgres.sh` - PostgreSQL setup script
- `migrate_to_postgres.py` - Main migration script
- `MIGRATION_GUIDE.md` - This guide
- `data_export_backup.json` - Backup of your data (created after migration)

---

**Good luck with your migration! 🚀**
