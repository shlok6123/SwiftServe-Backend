# Stage 1: Build the application with Java 21
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Grant execution rights
RUN chmod +x ./mvnw

# Build the app
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the runtime image with Java 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

# Memory limits for Render free tier
ENV JAVA_OPTS="-Xmx300m -Xms300m"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
