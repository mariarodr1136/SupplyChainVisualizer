FROM maven:3.8.6-eclipse-temurin-11 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
# Create a minimal application.properties (the real config comes from application-render.properties + env vars)
RUN echo "spring.application.name=supply-chain-visualizer" > src/main/resources/application.properties
RUN mvn package -DskipTests -B

FROM eclipse-temurin:11-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]
