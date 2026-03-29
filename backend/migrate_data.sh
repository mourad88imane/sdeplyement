#!/bin/bash

# SQLite to PostgreSQL Migration Script
# This script migrates data from SQLite to PostgreSQL

set -e  # Exit on error

echo "=========================================="
echo "SQLite to PostgreSQL Migration"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if SQLite database exists
if [ ! -f "db.sqlite3" ]; then
    echo -e "${RED}✗ SQLite database not found: db.sqlite3${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found SQLite database${NC}"
echo ""

# Step 1: Backup current settings
echo "[1/6] Backing up settings..."
cp school_backend/settings.py school_backend/settings.py.backup
echo -e "${GREEN}✓ Settings backed up${NC}"
echo ""

# Step 2: Configure Django to use SQLite temporarily
echo "[2/6] Configuring Django for SQLite export..."
cat > school_backend/settings_sqlite.py << 'EOF'
from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
EOF
echo -e "${GREEN}✓ SQLite settings created${NC}"
echo ""

# Step 3: Export data from SQLite
echo "[3/6] Exporting data from SQLite..."
DJANGO_SETTINGS_MODULE=school_backend.settings_sqlite python3 manage.py dumpdata \
    --natural-foreign \
    --natural-primary \
    --indent 2 \
    --exclude contenttypes \
    --exclude auth.permission \
    --exclude sessions \
    --exclude admin.logentry \
    --output data_export.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Data exported successfully${NC}"
    echo "   File: data_export.json"
    echo "   Size: $(du -h data_export.json | cut -f1)"
else
    echo -e "${RED}✗ Failed to export data${NC}"
    exit 1
fi
echo ""

# Step 4: Setup PostgreSQL database
echo "[4/6] Setting up PostgreSQL database..."
echo "   Running migrations..."
python3 manage.py migrate --run-syncdb

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PostgreSQL database ready${NC}"
else
    echo -e "${RED}✗ Failed to setup PostgreSQL${NC}"
    exit 1
fi
echo ""

# Step 5: Import data into PostgreSQL
echo "[5/6] Importing data into PostgreSQL..."
python3 manage.py loaddata data_export.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Data imported successfully${NC}"
else
    echo -e "${YELLOW}⚠ Warning: Some data may not have been imported${NC}"
    echo "   This is normal if there are some conflicts"
    echo "   Please review the output above"
fi
echo ""

# Step 6: Cleanup
echo "[6/6] Cleaning up..."
mv data_export.json data_export_backup.json
rm -f school_backend/settings_sqlite.py
rm -f school_backend/settings_sqlite.pyc
rm -rf school_backend/__pycache__/settings_sqlite.*
echo -e "${GREEN}✓ Cleanup completed${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}✓ Migration completed!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
echo "  • Data exported from SQLite"
echo "  • PostgreSQL database configured"
echo "  • Data imported into PostgreSQL"
echo "  • Backup saved as: data_export_backup.json"
echo ""
echo "Next steps:"
echo "  1. Verify your data: python3 manage.py shell"
echo "  2. Start server: python3 manage.py runserver"
echo ""
echo "If you encounter any issues, you can:"
echo "  • Check the backup: data_export_backup.json"
echo "  • Restore settings: mv school_backend/settings.py.backup school_backend/settings.py"
echo "=========================================="
