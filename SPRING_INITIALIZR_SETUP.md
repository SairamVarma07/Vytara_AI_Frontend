# Spring Initializr Setup Guide - Vytara Wellbeing App

## 🌐 Step-by-Step Instructions for https://start.spring.io/

Follow these **EXACT** settings when creating your Spring Boot project.

---

## 📋 Project Settings

### Go to: https://start.spring.io/

---

## Section 1: Project Metadata

### **Project**
Select: **Maven**
- ✅ Maven is the standard build tool for Java projects
- ❌ Don't select Gradle (unless you prefer it)

### **Language**
Select: **Java**
- ✅ We're using Java for this project
- ❌ Don't select Kotlin or Groovy

### **Spring Boot Version**
Select: **3.2.1** (or latest 3.2.x version)
- ✅ Use the latest stable 3.2.x release
- ⚠️ Avoid SNAPSHOT or M (milestone) versions
- ❌ Don't use 3.3.x yet (might be unstable)

---

## Section 2: Project Metadata

### **Group**
Enter: `com.vytara`
- This is your organization identifier
- Standard reverse domain name notation

### **Artifact**
Enter: `wellbeingapp`
- This will be your project name
- Keep it lowercase, no spaces

### **Name**
Enter: `Vytara Wellbeing App`
- Display name for your application
- Can have spaces and capitals

### **Description**
Enter: `Wellbeing application with nutrition tracking, task management, and AI chat`
- Brief description of your project

### **Package Name**
Auto-filled: `com.vytara.wellbeingapp`
- This is correct, leave as-is

### **Packaging**
Select: **Jar**
- ✅ Standard for Spring Boot applications
- ❌ Don't select War (that's for traditional app servers)

### **Java Version**
Select: **17** or **21**
- ✅ Java 17 (LTS - Long Term Support) - Recommended for production
- ✅ Java 21 (Latest LTS) - Also good choice
- ❌ Don't use Java 11 (older)

**Recommended: Java 17** (most stable, widely used)

---

## Section 3: Dependencies

Click "ADD DEPENDENCIES" and add these **EXACT** dependencies:

### ✅ **Required Dependencies** (Must Have!)

1. **Spring Web**
   - Type: `Spring Web`
   - Description: Build web applications with Spring MVC and Tomcat
   - ✅ REQUIRED for REST API

2. **Spring Data JPA**
   - Type: `Spring Data JPA`
   - Description: Persist data in SQL stores with Java Persistence API
   - ✅ REQUIRED for database operations

3. **Spring Security**
   - Type: `Spring Security`
   - Description: Authentication and authorization framework
   - ✅ REQUIRED for JWT authentication

4. **PostgreSQL Driver**
   - Type: `PostgreSQL Driver`
   - Description: JDBC driver for PostgreSQL
   - ✅ REQUIRED for PostgreSQL connection

5. **Validation**
   - Type: `Validation`
   - Description: Bean Validation with Hibernate validator
   - ✅ REQUIRED for input validation

### 🔧 **Recommended Dependencies** (Highly Recommended!)

6. **Lombok**
   - Type: `Lombok`
   - Description: Java annotation library which helps to reduce boilerplate code
   - ✅ RECOMMENDED - Saves a lot of coding time
   - Adds @Data, @AllArgsConstructor, etc.

7. **Spring Boot DevTools**
   - Type: `Spring Boot DevTools`
   - Description: Fast application restarts, LiveReload, and configurations
   - ✅ RECOMMENDED for development
   - Auto-restarts when you make changes

---

## 📸 Visual Reference

Your screen should look like this:

```
┌─────────────────────────────────────────────────────────┐
│ SPRING INITIALIZR                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Project                                                 │
│ ● Maven Project  ○ Gradle - Groovy  ○ Gradle - Kotlin │
│                                                         │
│ Language                                                │
│ ● Java  ○ Kotlin  ○ Groovy                            │
│                                                         │
│ Spring Boot                                             │
│ ● 3.2.1 (or latest 3.2.x)                             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Project Metadata                                        │
│                                                         │
│ Group:          com.vytara                             │
│ Artifact:       wellbeingapp                           │
│ Name:           Vytara Wellbeing App                   │
│ Description:    Wellbeing application with nutrition...│
│ Package name:   com.vytara.wellbeingapp                │
│ Packaging:      ● Jar  ○ War                          │
│ Java:           ● 17  ○ 21                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Dependencies (7 selected)                               │
│                                                         │
│ ✓ Spring Web                                           │
│ ✓ Spring Data JPA                                      │
│ ✓ Spring Security                                      │
│ ✓ PostgreSQL Driver                                    │
│ ✓ Validation                                           │
│ ✓ Lombok                                               │
│ ✓ Spring Boot DevTools                                 │
│                                                         │
│        [GENERATE]  [EXPLORE]  [SHARE...]               │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Complete Settings Summary

Copy this for reference:

```
PROJECT:
  Type: Maven
  Language: Java
  Spring Boot: 3.2.1

METADATA:
  Group: com.vytara
  Artifact: wellbeingapp
  Name: Vytara Wellbeing App
  Description: Wellbeing application with nutrition tracking, task management, and AI chat
  Package name: com.vytara.wellbeingapp
  Packaging: Jar
  Java: 17

DEPENDENCIES:
  ✓ Spring Web
  ✓ Spring Data JPA
  ✓ Spring Security
  ✓ PostgreSQL Driver
  ✓ Validation
  ✓ Lombok
  ✓ Spring Boot DevTools
```

---

## 🚀 Next Steps

### Step 1: Generate Project
Click the **"GENERATE"** button (or press Ctrl+Enter / Cmd+Enter)

This will download a ZIP file named: `wellbeingapp.zip`

### Step 2: Extract to Your Project Location

```bash
# Navigate to your project directory
cd /Users/sairamvarma/Desktop/ProjectZ/vytara/

# Move the downloaded ZIP here (from Downloads folder)
mv ~/Downloads/wellbeingapp.zip .

# Extract the ZIP
unzip wellbeingapp.zip

# Rename to match backend naming
mv wellbeingapp wellbeingapp-backend

# Enter the directory
cd wellbeingapp-backend
```

### Step 3: Verify Structure

You should now have:
```
wellbeingapp-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── vytara/
│   │   │           └── wellbeingapp/
│   │   │               └── WellbeingappApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
├── pom.xml
├── mvnw (Maven wrapper)
├── mvnw.cmd
└── .gitignore
```

### Step 4: Add JWT Dependencies

The Spring Initializr doesn't include JWT libraries by default. You need to add them manually.

Open `pom.xml` and add these dependencies inside the `<dependencies>` section:

```xml
<!-- JWT Dependencies -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

### Step 5: Verify Maven Build

```bash
# Clean and build the project
./mvnw clean install

# If successful, you'll see: BUILD SUCCESS
```

---

## ✅ Verification Checklist

Check off these items:

- [ ] Downloaded `wellbeingapp.zip` from Spring Initializr
- [ ] Extracted to `/Users/sairamvarma/Desktop/ProjectZ/vytara/wellbeingapp-backend/`
- [ ] Project structure exists (src/, pom.xml, etc.)
- [ ] `pom.xml` contains all 7 dependencies
- [ ] Added JWT dependencies to `pom.xml`
- [ ] `./mvnw clean install` runs successfully
- [ ] `WellbeingappApplication.java` exists

---

## 🎯 What You Have Now

After completing these steps, you have:
- ✅ Spring Boot project structure
- ✅ Maven configuration
- ✅ All required dependencies
- ✅ JWT libraries added
- ✅ Ready for development!

---

## 🆘 Troubleshooting

### "Command not found: ./mvnw"
**Solution:** Make it executable:
```bash
chmod +x mvnw
```

### "BUILD FAILURE" errors
**Solution:** 
1. Check you have Java 17+ installed: `java -version`
2. Check internet connection (Maven downloads dependencies)
3. Try: `./mvnw clean install -U` (force update)

### Can't find project after extraction
**Solution:** Check Downloads folder:
```bash
ls ~/Downloads/wellbeingapp.zip
```

---

## 📚 Next Steps

Once you have the project created and verified:

1. **Configure Database:** Follow `SPRINGBOOT_IMPLEMENTATION_GUIDE.md` Step 3
2. **Set up application.yml:** Follow Step 4
3. **Start implementing authentication:** Use `SPRINGBOOT_AUTH_COMPLETE.md`

---

## 🎉 You're Ready!

Your Spring Boot project is now created with all the correct dependencies. 

**Next:** Open the project in IntelliJ IDEA or your preferred IDE and continue with the implementation guide!


