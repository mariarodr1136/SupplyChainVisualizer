#!/bin/sh
# Convert Render's postgres:// URI to Spring Boot's jdbc:postgresql:// format
if [ -n "$DATABASE_URL" ]; then
  export SPRING_DATASOURCE_URL=$(echo "$DATABASE_URL" | sed 's|postgres://|jdbc:postgresql://|' | sed 's|postgresql://|jdbc:postgresql://|')
fi
exec java -jar app.jar --spring.profiles.active=render
