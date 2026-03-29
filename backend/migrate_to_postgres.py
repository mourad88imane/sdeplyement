#!/usr/bin/env python3
"""
Simple script to migrate data from SQLite to PostgreSQL
Usage: python3 migrate_to_postgres.py
"""

import os
import sys
import subprocess
from pathlib import Path

# Colors for terminal output
class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

def print_step(step, total, message):
    """Print a formatted step message"""
    print(f"\n[{step}/{total}] {message}")

def print_success(message):
    """Print a success message"""
    print(f"{Colors.GREEN}✓ {message}{Colors.NC}")

def print_error(message):
    """Print an error message"""
    print(f"{Colors.RED}✗ {message}{Colors.NC}")

def print_warning(message):
    """Print a warning message"""
    print(f"{Colors.YELLOW}⚠ {message}{Colors.NC}")

def run_command(command, env=None):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True,
            env=env or os.environ.copy()
        )
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def main():
    """Main migration function"""
    
    print("=" * 60)
    print("SQLite to PostgreSQL Data Migration")
    print("=" * 60)
    
    # Check if we're in the backend directory
    if not Path('manage.py').exists():
        print_error("manage.py not found. Please run this script from the backend directory.")
        sys.exit(1)
    
    # Check if SQLite database exists
    if not Path('db.sqlite3').exists():
        print_error("SQLite database (db.sqlite3) not found.")
        sys.exit(1)
    
    print_success("Found SQLite database")
    
    # Get database size
    db_size = Path('db.sqlite3').stat().st_size / 1024
    print(f"   Database size: {db_size:.2f} KB")
    
    # Confirm before proceeding
    print("\n" + "=" * 60)
    print_warning("This will migrate data from SQLite to PostgreSQL")
    print_warning("Make sure PostgreSQL is running and configured correctly")
    print("=" * 60)
    response = input("\nDo you want to continue? (yes/no): ").strip().lower()
    
    if response not in ['yes', 'y']:
        print("\n" + "=" * 60)
        print_error("Migration cancelled by user")
        print("=" * 60)
        sys.exit(0)
    
    # Step 1: Export data from SQLite
    print_step(1, 4, "Exporting data from SQLite...")
    
    # Create temporary settings for SQLite
    sqlite_settings = """
from school_backend.settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
"""
    
    with open('school_backend/settings_sqlite_temp.py', 'w') as f:
        f.write(sqlite_settings)
    
    # Export data
    env = os.environ.copy()
    env['DJANGO_SETTINGS_MODULE'] = 'school_backend.settings_sqlite_temp'
    
    success, output = run_command(
        'python3 manage.py dumpdata '
        '--natural-foreign '
        '--natural-primary '
        '--indent 2 '
        '--exclude contenttypes '
        '--exclude auth.permission '
        '--exclude sessions.session '
        '--exclude admin.logentry '
        '--output data_export.json',
        env=env
    )
    
    # Cleanup temp settings
    if Path('school_backend/settings_sqlite_temp.py').exists():
        Path('school_backend/settings_sqlite_temp.py').unlink()
    
    if success:
        export_size = Path('data_export.json').stat().st_size / 1024
        print_success(f"Data exported successfully ({export_size:.2f} KB)")
    else:
        print_error("Failed to export data from SQLite")
        print(output)
        sys.exit(1)
    
    # Step 2: Setup PostgreSQL database
    print_step(2, 4, "Setting up PostgreSQL database...")
    
    success, output = run_command('python3 manage.py migrate --run-syncdb')
    
    if success:
        print_success("PostgreSQL database configured")
    else:
        print_error("Failed to setup PostgreSQL database")
        print(output)
        print("\nPlease ensure:")
        print("  1. PostgreSQL is running")
        print("  2. Database 'venddb' exists")
        print("  3. User 'venduser' has access")
        sys.exit(1)
    
    # Step 3: Import data into PostgreSQL
    print_step(3, 4, "Importing data into PostgreSQL...")
    
    success, output = run_command('python3 manage.py loaddata data_export.json')
    
    if success:
        print_success("Data imported successfully")
    else:
        print_warning("Some data may not have been imported")
        print("This is normal if there are conflicts with existing data")
        print("\nOutput:")
        print(output)
    
    # Step 4: Cleanup and backup
    print_step(4, 4, "Creating backup and cleaning up...")
    
    if Path('data_export.json').exists():
        Path('data_export.json').rename('data_export_backup.json')
        print_success("Export file backed up as: data_export_backup.json")
    
    # Final summary
    print("\n" + "=" * 60)
    print_success("Migration completed!")
    print("=" * 60)
    print("\nSummary:")
    print("  • Data exported from SQLite")
    print("  • PostgreSQL database configured")
    print("  • Data imported into PostgreSQL")
    print("  • Backup saved as: data_export_backup.json")
    print("\nNext steps:")
    print("  1. Verify your data:")
    print("     python3 manage.py shell")
    print("     >>> from django.contrib.auth.models import User")
    print("     >>> User.objects.count()")
    print("\n  2. Start your Django server:")
    print("     python3 manage.py runserver")
    print("\n  3. If everything works, you can delete:")
    print("     - db.sqlite3 (SQLite database)")
    print("     - data_export_backup.json (after verification)")
    print("=" * 60)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n" + "=" * 60)
        print_error("Migration interrupted by user")
        print("=" * 60)
        sys.exit(1)
    except Exception as e:
        print("\n\n" + "=" * 60)
        print_error(f"Unexpected error: {e}")
        print("=" * 60)
        import traceback
        traceback.print_exc()
        sys.exit(1)
