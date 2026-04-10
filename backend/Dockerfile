# Étape 1 : Build avec Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# On copie le pom.xml et les sources
COPY pom.xml .
COPY src ./src
# On package l'application en ignorant les tests pour gagner du temps au build
RUN mvn clean package -DskipTests

# Étape 2 : Exécution avec Java
FROM eclipse-temurin:21-jre
WORKDIR /app
# On récupère le fichier .jar généré à l'étape précédente
COPY --from=build /app/target/*.jar app.jar
# Port exposé par Spring Boot
EXPOSE 8080
# Lancement de l'application
ENTRYPOINT ["java", "-jar", "app.jar"]