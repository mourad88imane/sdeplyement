#!/bin/bash

# PostgreSQL Setup Script for Django Project
# This script sets up the PostgreSQL database and user

echo "=========================================="
echo "PostgreSQL Database Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Database configuration
DB_NAME="venddb"
DB_USER="venduser"
DB_PASSWORD="mouraD&88"

echo "Configuration:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""

# Check if PostgreSQL is running
echo "[1/4] Checking PostgreSQL status..."
if pg_isready -q; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL is not running${NC}"
    echo "   Starting PostgreSQL..."
    brew services start postgresql@15
    sleep 3
    if pg_isready -q; then
        echo -e "${GREEN}✓ PostgreSQL started${NC}"
    else
        echo -e "${RED}✗ Failed to start PostgreSQL${NC}"
        exit 1
    fi
fi
echo ""

# Drop existing user if exists (to fix case sensitivity issues)
echo "[2/4] Setting up database user..."
psql postgres -c "DROP USER IF EXISTS venduser;" 2>/dev/null
psql postgres -c "DROP USER IF EXISTS vendUser;" 2>/dev/null
psql postgres -c "DROP USER IF EXISTS \"vendUser\";" 2>/dev/null

# Create user with lowercase name
psql postgres -c "CREATE USER venduser WITH PASSWORD '$DB_PASSWORD' CREATEDB SUPERUSER;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ User 'venduser' created${NC}"
else
    echo -e "${YELLOW}⚠ User may already exist, continuing...${NC}"
fi
echo ""

# Create database
echo "[3/4] Setting up database..."
psql postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null
psql postgres -c "CREATE DATABASE $DB_NAME OWNER venduser;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database '$DB_NAME' created${NC}"
else
    echo -e "${RED}✗ Failed to create database${NC}"
    exit 1
fi
echo ""

# Grant privileges
echo "[4/4] Granting privileges..."
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO venduser;" 2>/dev/null
echo -e "${GREEN}✓ Privileges granted${NC}"
echo ""

# Test connection
echo "Testing connection..."
if PGPASSWORD=$DB_PASSWORD psql -U venduser -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Connection test successful${NC}"
else
    echo -e "${RED}✗ Connection test failed${NC}"
    exit 1
fi
echo ""

echo "=========================================="
echo -e "${GREEN}✓ PostgreSQL setup completed!${NC}"
echo "=========================================="
echo ""
echo "Database Details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: $DB_NAME"
echo "  User: venduser"
echo "  Password: $DB_PASSWORD"
echo ""
echo "Next steps:"
echo "  1. Run migrations: python3 manage.py migrate"
echo "  2. Migrate data: python3 migrate_to_postgres.py"
echo "  3. Start server: python3 manage.py runserver"
echo "=========================================="
