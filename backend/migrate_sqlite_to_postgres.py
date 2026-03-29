#!/usr/bin/env python3
"""
Script to migrate data from SQLite to PostgreSQL
This script will:
1. Export data from SQLite database
2. Import data into PostgreSQL database
"""

import os
import sys
import django
import json
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')

# Configure Django to use SQLite temporarily
os.environ['USE_SQLITE'] = 'true'

print("=" * 60)
print("SQLite to PostgreSQL Migration Script")
print("=" * 60)

def export_from_sqlite():
    """Export data from SQLite database"""
    print("\n[1/4] Exporting data from SQLite...")
    
    # Temporarily configure Django to use SQLite
    from django.conf import settings
    
    # Save original database config
    original_db = settings.DATABASES['default'].copy()
    
    # Configure SQLite
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': backend_dir / 'db.sqlite3',
    }
    
    # Setup Django
    django.setup()
    
    # Export data using dumpdata
    from django.core.management import call_command
    from io import StringIO
    
    output = StringIO()
    
    try:
        # Get all installed apps
        from django.apps import apps
        app_labels = [app.label for app in apps.get_app_configs() 
                     if not app.label.startswith('django.contrib') 
                     and app.label not in ['contenttypes', 'sessions', 'admin', 'auth']]
        
        print(f"   Found apps to export: {', '.join(app_labels)}")
        
        # Export data
        call_command('dumpdata', 
                    '--natural-foreign', 
                    '--natural-primary',
                    '--indent', '2',
                    '--output', str(backend_dir / 'data_export.json'),
                    exclude=['contenttypes', 'auth.permission', 'sessions'])
        
        print(f"   ✓ Data exported to: {backend_dir / 'data_export.json'}")
        
        # Restore original database config
        settings.DATABASES['default'] = original_db
        
        return True
        
    except Exception as e:
        print(f"   ✗ Error exporting data: {e}")
        settings.DATABASES['default'] = original_db
        return False

def setup_postgres():
    """Setup PostgreSQL database"""
    print("\n[2/4] Setting up PostgreSQL database...")
    
    try:
        # Reconfigure Django for PostgreSQL
        django.setup()
        
        from django.core.management import call_command
        
        # Run migrations
        print("   Running migrations...")
        call_command('migrate', '--run-syncdb', verbosity=0)
        print("   ✓ Migrations completed")
        
        return True
        
    except Exception as e:
        print(f"   ✗ Error setting up PostgreSQL: {e}")
        return False

def import_to_postgres():
    """Import data into PostgreSQL"""
    print("\n[3/4] Importing data into PostgreSQL...")
    
    data_file = backend_dir / 'data_export.json'
    
    if not data_file.exists():
        print(f"   ✗ Export file not found: {data_file}")
        return False
    
    try:
        from django.core.management import call_command
        
        # Load data
        call_command('loaddata', str(data_file), verbosity=1)
        print("   ✓ Data imported successfully")
        
        return True
        
    except Exception as e:
        print(f"   ✗ Error importing data: {e}")
        print(f"   You may need to manually review the data_export.json file")
        return False

def cleanup():
    """Cleanup temporary files"""
    print("\n[4/4] Cleaning up...")
    
    data_file = backend_dir / 'data_export.json'
    
    try:
        if data_file.exists():
            # Keep the file for backup
            backup_file = backend_dir / 'data_export_backup.json'
            data_file.rename(backup_file)
            print(f"   ✓ Export file backed up to: {backup_file}")
        
        return True
        
    except Exception as e:
        print(f"   ⚠ Warning: Could not cleanup: {e}")
        return True  # Don't fail on cleanup errors

def main():
    """Main migration function"""
    
    # Check if SQLite database exists
    sqlite_db = backend_dir / 'db.sqlite3'
    if not sqlite_db.exists():
        print(f"\n✗ SQLite database not found: {sqlite_db}")
        print("   Please ensure the database file exists before running this script.")
        sys.exit(1)
    
    print(f"\n✓ Found SQLite database: {sqlite_db}")
    print(f"   Size: {sqlite_db.stat().st_size / 1024:.2f} KB")
    
    # Confirm before proceeding
    print("\n⚠ WARNING: This will overwrite any existing data in PostgreSQL!")
    response = input("Do you want to continue? (yes/no): ").strip().lower()
    
    if response not in ['yes', 'y']:
        print("\n✗ Migration cancelled by user")
        sys.exit(0)
    
    # Run migration steps
    steps = [
        export_from_sqlite,
        setup_postgres,
        import_to_postgres,
        cleanup
    ]
    
    for step in steps:
        if not step():
            print(f"\n✗ Migration failed at step: {step.__name__}")
            print("   Please check the errors above and try again.")
            sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✓ Migration completed successfully!")
    print("=" * 60)
    print("\nYour data has been migrated from SQLite to PostgreSQL.")
    print("You can now start your Django server with PostgreSQL.")
    print("\nNext steps:")
    print("  1. Verify the data in PostgreSQL")
    print("  2. Start your Django server: python3 manage.py runserver")
    print("  3. Backup file saved as: data_export_backup.json")
    print("=" * 60)

if __name__ == '__main__':
    main()
