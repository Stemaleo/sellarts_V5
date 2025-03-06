# Use an official Maven image to build the application
FROM maven AS builder

# Set the working directory
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src
COPY src/main/resources/application-prod.properties ./src/main/resources/application.properties

# Build the application
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as a parent imaged
FROM openjdk:21-jdk

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=builder /app/target/ArtSell-0.0.1-SNAPSHOT.jar ./app.jar

# Expose the port your application will run on
#EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]