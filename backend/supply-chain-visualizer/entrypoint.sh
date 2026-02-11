#!/bin/sh
# Parse Render's connection string into separate JDBC components
# Render format: postgresql://user:password@host[:port]/database
if [ -n "$DATABASE_URL" ]; then
  # Strip the protocol prefix
  DB_TEMP=$(echo "$DATABASE_URL" | sed 's|^.*://||')
  # Extract user (before the colon)
  export SPRING_DATASOURCE_USERNAME=$(echo "$DB_TEMP" | sed 's|:.*||')
  # Extract password (between first colon and @)
  export SPRING_DATASOURCE_PASSWORD=$(echo "$DB_TEMP" | sed 's|^[^:]*:||' | sed 's|@.*||')
  # Extract host and database (after @)
  DB_HOST_AND_DB=$(echo "$DB_TEMP" | sed 's|^.*@||')
  # Build clean JDBC URL (no credentials)
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST_AND_DB}"
fi
exec java -jar app.jar --spring.profiles.active=render
