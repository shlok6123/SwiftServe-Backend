# Stage 1: Build the application
# Assuming Spring Boot 3.x (Requires Java 17+)
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x ./mvnw

# Fact: -DskipTests speeds up deployment builds
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

# Best Practice: Limit JVM memory to fit inside Render's 512MB free tier limit
ENV JAVA_OPTS="-Xmx300m -Xms300m"

# Render detects the EXPOSE instruction to bind external traffic
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
