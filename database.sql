-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bohojazz_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address_line1` varchar(200) NOT NULL,
  `address_line2` varchar(200) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `pincode` varchar(20) NOT NULL,
  `country` varchar(100) DEFAULT 'India',
  `is_default` tinyint(1) DEFAULT '0',
  `address_type` enum('home','work','other') DEFAULT 'home',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,11,'Neha Verma','9876502001','B-204, Sunshine Apartments, Sector 15','Near Metro Station','Noida','Uttar Pradesh','201301','India',1,'home','2026-04-15 05:48:30'),(2,12,'Pooja Joshi','9876502002','12, Rose Garden Colony',NULL,'Jaipur','Rajasthan','302001','India',1,'home','2026-04-15 05:48:30'),(3,13,'Sunita Rao','9876502003','Flat 3B, Green Valley, Koramangala','4th Block','Bengaluru','Karnataka','560034','India',1,'home','2026-04-15 05:48:30'),(4,14,'Divya Menon','9876502004','77, Indiranagar, 100 Feet Road',NULL,'Bengaluru','Karnataka','560038','India',1,'home','2026-04-15 05:48:30'),(5,15,'Aisha Khan','9876502005','C-15, Banjara Hills','Road No. 12','Hyderabad','Telangana','500034','India',1,'home','2026-04-15 05:48:30'),(6,16,'Shreya Das','9876502006','45, Lake Town',NULL,'Kolkata','West Bengal','700089','India',1,'home','2026-04-15 05:48:30'),(7,3,'user','9020784512','lakhana etawah utter pradesh',NULL,'etawah ','up','206127','India',0,'home','2026-04-15 06:24:43'),(8,17,'ABHISHEK PRAJAPATI','+919027874600','ap869533@gmail.com',NULL,'ETAWAH ','UTTER PRADESH ','206127','India',0,'home','2026-05-19 10:10:55');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `subtitle` varchar(300) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `position` enum('hero','sidebar','popup','category') DEFAULT 'hero',
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `starts_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ends_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'New Winter Collection','Classic · Contemporary · Fusion','https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=80','/shop?sort=newest','Shop Now','hero',1,1,'2026-04-15 05:48:30',NULL,'2026-04-15 05:48:30'),(2,'Festival Season Sale','Up to 40% Off on Select Styles','https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1400&q=80','/shop/sale','Shop Sale','hero',2,1,'2026-04-15 05:48:30',NULL,'2026-04-15 05:48:30'),(3,'Bridal Collection 2025','Lehengas · Sarees · Anarkalis','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80','/shop/co-ords-sets','Explore','hero',3,1,'2026-04-15 05:48:30',NULL,'2026-04-15 05:48:30'),(4,'Boho Summer Dresses','Light, Flowy & Free-Spirited','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80','/shop/dresses','Shop Dresses','sidebar',1,1,'2026-04-15 05:48:30',NULL,'2026-04-15 05:48:30');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart_item` (`user_id`,`product_id`,`variant_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (4,5,1,NULL,1,'2026-04-15 10:19:26','2026-04-15 10:19:26'),(15,5,5,NULL,1,'2026-05-07 12:28:05','2026-05-07 12:28:05');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_parent` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Kurtas & Suits','kurtas-suits','Traditional and fusion kurtas for all occasions',NULL,NULL,1,1,'2026-04-14 11:50:53'),(2,'Dresses','dresses','Beautiful boho dresses and maxi dresses',NULL,NULL,2,1,'2026-04-14 11:50:53'),(3,'Tops & Blouses','tops-blouses','Stylish tops and blouses',NULL,NULL,3,1,'2026-04-14 11:50:53'),(4,'Bottoms','bottoms','Palazzos, skirts and trousers',NULL,NULL,4,1,'2026-04-14 11:50:53'),(5,'Co-ords & Sets','co-ords-sets','Matching co-ord sets',NULL,NULL,5,1,'2026-04-14 11:50:53'),(6,'Dupattas & Stoles','dupattas-stoles','Beautiful dupattas and stoles',NULL,NULL,6,1,'2026-04-14 11:50:53'),(7,'Accessories','accessories','Jewellery and accessories',NULL,NULL,7,1,'2026-04-14 11:50:53'),(8,'Sale','sale','Sale items',NULL,NULL,8,1,'2026-04-14 11:50:53');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `type` enum('percentage','fixed') DEFAULT 'percentage',
  `value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT '0.00',
  `max_discount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT '0',
  `per_user_limit` int DEFAULT '1',
  `vendor_id` int DEFAULT NULL,
  `starts_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `vendor_id` (`vendor_id`),
  KEY `idx_code` (`code`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'WELCOME10','percentage',10.00,500.00,200.00,NULL,47,1,NULL,'2026-04-15 05:48:30','2027-04-15 05:48:30',1,'2026-04-15 05:48:30'),(2,'FLAT200','fixed',200.00,1500.00,NULL,100,24,1,NULL,'2026-04-15 05:48:30','2026-07-14 05:48:30',1,'2026-04-15 05:48:30'),(3,'BOHO20','percentage',20.00,1000.00,500.00,50,12,1,NULL,'2026-04-15 05:48:30','2026-06-14 05:48:30',1,'2026-04-15 05:48:30'),(4,'FESTIVE15','percentage',15.00,800.00,300.00,200,67,1,NULL,'2026-04-15 05:48:30','2026-05-15 05:48:30',1,'2026-04-15 05:48:30'),(5,'NEWUSER','percentage',25.00,0.00,250.00,1000,234,1,NULL,'2026-04-15 05:48:30','2026-10-12 05:48:30',1,'2026-04-15 05:48:30'),(6,'ETHNIC30','percentage',30.00,2000.00,600.00,30,8,1,2,'2026-04-15 05:48:30','2026-05-30 05:48:30',1,'2026-04-15 05:48:30'),(7,'SILK500','fixed',500.00,5000.00,NULL,20,5,1,6,'2026-04-15 05:48:30','2026-05-15 05:48:30',1,'2026-04-15 05:48:30');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` enum('order','product','system','promotion','review') DEFAULT 'system',
  `is_read` tinyint(1) DEFAULT '0',
  `data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_read` (`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,11,'Order Delivered!','Your order BJ-SAMPLE-0001 has been delivered. Enjoy your Maxi Boho Floral Dress!','order',1,NULL,'2026-04-15 05:48:30'),(2,11,'Welcome to BohoJazz!','Discover our latest boho fashion collections. Use code WELCOME10 for 10% off!','promotion',0,NULL,'2026-04-15 05:48:30'),(3,12,'Order Shipped!','Your order BJ-SAMPLE-0002 has been shipped. Track your order now.','order',0,NULL,'2026-04-15 05:48:30'),(4,13,'Order Confirmed!','Your order BJ-SAMPLE-0003 has been confirmed and is being prepared.','order',0,NULL,'2026-04-15 05:48:30'),(5,15,'New Order Placed','Your order BJ-SAMPLE-0004 has been placed successfully.','order',0,NULL,'2026-04-15 05:48:30'),(6,3,'Order Placed!','Your order #BJ-MNZO2CTF-OAQC has been placed successfully.','order',0,NULL,'2026-04-15 06:25:40'),(7,3,'Order Placed!','Your order #BJ-MNZT4HKI-DZKP has been placed successfully.','order',0,NULL,'2026-04-15 08:47:18'),(8,3,'Order Placed!','Your order #BJ-MNZWQQ9J-74L3 has been placed successfully.','order',0,NULL,'2026-04-15 10:28:34'),(9,3,'Order Placed!','Your order #BJ-MO00L5JV-40YX has been placed successfully.','order',0,NULL,'2026-04-15 12:16:13'),(10,3,'Order Placed!','Your order #BJ-MO00UDMK-9QEQ has been placed successfully.','order',0,NULL,'2026-04-15 12:23:23'),(11,3,'Order Placed!','Your order #BJ-MO02109Z-MQTD has been placed successfully.','order',0,NULL,'2026-04-15 12:56:32'),(12,3,'Order Placed!','Your order #BJ-MO0AJCBO-75AU has been placed successfully.','order',0,NULL,'2026-04-15 16:54:44'),(13,3,'Order Placed!','Your order #BJ-MO12V20T-E6AM has been placed successfully.','order',0,NULL,'2026-04-16 06:07:40'),(14,3,'Order Placed!','Your order #BJ-MO136JWE-6L0P has been placed successfully.','order',0,NULL,'2026-04-16 06:16:36'),(15,3,'Order Placed!','Your order #BJ-MO1FKS2A-40FE has been placed successfully.','order',0,NULL,'2026-04-16 12:03:36'),(16,17,'Order Placed!','Your order #BJ-MPCH32KF-6YXC has been placed successfully.','order',0,NULL,'2026-05-19 10:10:59'),(17,17,'Order Placed!','Your order #BJ-MPCIXNJU-KH7N has been placed successfully.','order',0,NULL,'2026-05-19 11:02:45'),(18,17,'Order Placed!','Your order #BJ-MPCKZ9RF-0G79 has been placed successfully.','order',0,NULL,'2026-05-19 12:00:00'),(19,17,'Order Placed!','Your order #BJ-MPCLPVIA-VZIP has been placed successfully.','order',0,NULL,'2026-05-19 12:21:37'),(20,17,'Order Placed!','Your order #BJ-MPCLXHT7-N5D9 has been placed successfully.','order',0,NULL,'2026-05-19 12:27:06'),(21,17,'Order Placed!','Your order #BJ-MPCUWX8C-2EIW has been placed successfully.','order',0,NULL,'2026-05-19 16:38:07');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `vendor_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `variant_name` varchar(100) DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `vendor_earnings` decimal(10,2) DEFAULT '0.00',
  `commission_amount` decimal(10,2) DEFAULT '0.00',
  `vendor_status` enum('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  `tracking_number` varchar(100) DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_vendor` (`vendor_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,5,3,NULL,'Maxi Boho Floral Dress','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',NULL,1,1699.00,1699.00,1529.10,169.90,'delivered',NULL,'2026-04-10 05:48:30','2026-04-13 05:48:30','2026-04-15 05:48:30'),(2,2,19,6,NULL,'Kanjivaram Silk Saree - Emerald Green','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',NULL,1,11999.00,11999.00,10799.10,1199.90,'shipped',NULL,'2026-04-13 05:48:30',NULL,'2026-04-15 05:48:30'),(3,2,14,5,NULL,'Banarasi Silk Dupatta Gold Border','https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&q=80',NULL,1,3499.00,3499.00,3149.10,349.90,'shipped',NULL,'2026-04-13 05:48:30',NULL,'2026-04-15 05:48:30'),(4,3,10,4,NULL,'Tie-Dye Co-ord Set','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',NULL,1,1999.00,1999.00,1799.10,199.90,'confirmed',NULL,NULL,NULL,'2026-04-15 05:48:30'),(5,3,16,5,NULL,'Oxidized Silver Jhumka Earrings Set','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',NULL,1,649.00,649.00,584.10,64.90,'confirmed',NULL,NULL,NULL,'2026-04-15 05:48:30'),(6,4,3,2,NULL,'Bandhani Print Kurti with Pants','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',NULL,1,1399.00,1399.00,1259.10,139.90,'pending',NULL,NULL,NULL,'2026-04-15 05:48:30'),(7,5,14,5,NULL,'Banarasi Silk Dupatta Gold Border','https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',NULL,1,3499.00,3499.00,3149.10,349.90,'pending',NULL,NULL,NULL,'2026-04-15 06:25:40'),(8,6,1,2,NULL,'Floral Anarkali Kurta with Dupatta','https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',NULL,1,1899.00,1899.00,1709.10,189.90,'pending',NULL,NULL,NULL,'2026-04-15 08:47:18'),(9,7,1,2,NULL,'Floral Anarkali Kurta with Dupatta','https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',NULL,1,1899.00,1899.00,1709.10,189.90,'pending',NULL,NULL,NULL,'2026-04-15 10:28:34'),(10,7,1,2,NULL,'Floral Anarkali Kurta with Dupatta','https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',NULL,1,1899.00,1899.00,1709.10,189.90,'pending',NULL,NULL,NULL,'2026-04-15 10:28:34'),(11,8,10,4,NULL,'Tie-Dye Co-ord Set','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',NULL,1,1999.00,1999.00,1799.10,199.90,'pending',NULL,NULL,NULL,'2026-04-15 12:16:13'),(12,9,5,3,NULL,'Maxi Boho Floral Dress','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',NULL,1,1699.00,1699.00,1529.10,169.90,'pending',NULL,NULL,NULL,'2026-04-15 12:23:23'),(13,10,5,3,NULL,'Maxi Boho Floral Dress','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',NULL,1,1699.00,1699.00,1529.10,169.90,'pending',NULL,NULL,NULL,'2026-04-15 12:56:32'),(14,11,22,6,NULL,'Kalamkari Printed Cotton Saree','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',NULL,1,2799.00,2799.00,2519.10,279.90,'pending',NULL,NULL,NULL,'2026-04-15 16:54:44'),(15,12,1,2,NULL,'Floral Anarkali Kurta with Dupatta','https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',NULL,1,1899.00,1899.00,1709.10,189.90,'pending',NULL,NULL,NULL,'2026-04-16 06:07:40'),(16,13,10,4,NULL,'Tie-Dye Co-ord Set','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',NULL,2,1999.00,3998.00,3598.20,399.80,'pending',NULL,NULL,NULL,'2026-04-16 06:16:36'),(17,14,10,4,NULL,'Tie-Dye Co-ord Set','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',NULL,1,1999.00,1999.00,1799.10,199.90,'pending',NULL,NULL,NULL,'2026-04-16 12:03:36'),(18,14,10,4,NULL,'Tie-Dye Co-ord Set','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',NULL,1,1999.00,1999.00,1799.10,199.90,'pending',NULL,NULL,NULL,'2026-04-16 12:03:36'),(19,15,3,2,NULL,'Bandhani Print Kurti with Pants','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',NULL,1,1399.00,1399.00,1259.10,139.90,'pending',NULL,NULL,NULL,'2026-05-19 10:10:59'),(20,16,23,1,NULL,'kurti set new desine','/uploads/c14a7efd-18b2-46ab-9b11-0af247e03258.jpg',NULL,1,4499.00,4499.00,4049.10,449.90,'pending',NULL,NULL,NULL,'2026-05-19 11:02:45'),(21,17,3,2,NULL,'Bandhani Print Kurti with Pants','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',NULL,1,1399.00,1399.00,1259.10,139.90,'pending',NULL,NULL,NULL,'2026-05-19 12:00:00'),(22,18,2,2,NULL,'Embroidered Straight Kurta Set','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',NULL,1,3299.00,3299.00,2969.10,329.90,'pending',NULL,NULL,NULL,'2026-05-19 12:21:37'),(23,19,20,6,NULL,'Mysore Crepe Silk Saree - Rose Pink','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',NULL,1,6999.00,6999.00,6299.10,699.90,'pending',NULL,NULL,NULL,'2026-05-19 12:27:06'),(24,19,20,6,NULL,'Mysore Crepe Silk Saree - Rose Pink','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',NULL,1,6999.00,6999.00,6299.10,699.90,'pending',NULL,NULL,NULL,'2026-05-19 12:27:06'),(25,20,1,2,NULL,'Floral Anarkali Kurta with Dupatta','https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',NULL,4,1899.00,7596.00,6836.40,759.60,'pending',NULL,NULL,NULL,'2026-05-19 16:38:07'),(26,20,2,2,NULL,'Embroidered Straight Kurta Set','https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',NULL,1,3299.00,3299.00,2969.10,329.90,'pending',NULL,NULL,NULL,'2026-05-19 16:38:07');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `address_id` int DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) DEFAULT '0.00',
  `shipping_amount` decimal(12,2) DEFAULT '0.00',
  `tax_amount` decimal(12,2) DEFAULT '0.00',
  `total_amount` decimal(12,2) NOT NULL,
  `coupon_id` int DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_id` varchar(200) DEFAULT NULL,
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled','returned') DEFAULT 'pending',
  `shipping_address` json DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `coupon_id` (`coupon_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_order_number` (`order_number`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'BJ-SAMPLE-0001',11,1,1899.00,190.00,0.00,308.34,2017.34,1,'upi','paid',NULL,'delivered','{\"city\": \"Noida\", \"name\": \"Neha Verma\", \"phone\": \"9876502001\", \"state\": \"Uttar Pradesh\", \"pincode\": \"201301\", \"address_line1\": \"B-204, Sunshine Apartments\"}',NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(2,'BJ-SAMPLE-0002',12,2,4498.00,0.00,0.00,809.64,5307.64,NULL,'cod','pending',NULL,'shipped','{\"city\": \"Jaipur\", \"name\": \"Pooja Joshi\", \"phone\": \"9876502002\", \"state\": \"Rajasthan\", \"pincode\": \"302001\", \"address_line1\": \"12, Rose Garden Colony\"}',NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(3,'BJ-SAMPLE-0003',13,3,2998.00,200.00,0.00,503.64,3301.64,NULL,'upi','paid',NULL,'confirmed','{\"city\": \"Bengaluru\", \"name\": \"Sunita Rao\", \"phone\": \"9876502003\", \"state\": \"Karnataka\", \"pincode\": \"560034\", \"address_line1\": \"Flat 3B, Green Valley\"}',NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(4,'BJ-SAMPLE-0004',15,5,1899.00,0.00,99.00,341.82,2339.82,NULL,'card','paid',NULL,'pending','{\"city\": \"Hyderabad\", \"name\": \"Aisha Khan\", \"phone\": \"9876502005\", \"state\": \"Telangana\", \"pincode\": \"500034\", \"address_line1\": \"C-15, Banjara Hills\"}',NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(5,'BJ-MNZO2CTF-OAQC',3,7,3499.00,200.00,0.00,593.82,3892.82,2,'upi','paid',NULL,'confirmed','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-15 06:25:40','2026-04-15 06:27:16'),(6,'BJ-MNZT4HKI-DZKP',3,7,1899.00,0.00,0.00,341.82,2240.82,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-15 08:47:18','2026-04-15 08:47:18'),(7,'BJ-MNZWQQ9J-74L3',3,7,3798.00,0.00,0.00,683.64,4481.64,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-15 10:28:34','2026-04-15 10:28:34'),(8,'BJ-MO00L5JV-40YX',3,7,1999.00,0.00,0.00,359.82,2358.82,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-15 12:16:13','2026-04-15 12:16:13'),(9,'BJ-MO00UDMK-9QEQ',3,7,1699.00,0.00,0.00,305.82,2004.82,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-15 12:23:23','2026-04-15 12:23:23'),(10,'BJ-MO02109Z-MQTD',3,7,1699.00,0.00,0.00,305.82,2004.82,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-15 12:56:32','2026-04-15 12:56:32'),(11,'BJ-MO0AJCBO-75AU',3,7,2799.00,0.00,0.00,503.82,3302.82,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-15 16:54:44','2026-04-15 16:54:44'),(12,'BJ-MO12V20T-E6AM',3,7,1899.00,0.00,0.00,341.82,2240.82,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-16 06:07:40','2026-04-16 06:07:40'),(13,'BJ-MO136JWE-6L0P',3,7,3998.00,0.00,0.00,719.64,4717.64,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-16 06:16:36','2026-04-16 06:16:36'),(14,'BJ-MO1FKS2A-40FE',3,7,3998.00,0.00,0.00,719.64,4717.64,NULL,'cod','pending',NULL,'pending','{\"city\": \"etawah \", \"name\": \"user\", \"phone\": \"9020784512\", \"state\": \"up\", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"lakhana etawah utter pradesh\", \"address_line2\": null}',NULL,'2026-04-16 12:03:36','2026-04-16 12:03:36'),(15,'BJ-MPCH32KF-6YXC',17,8,1399.00,139.90,0.00,226.64,1485.74,1,'upi','pending',NULL,'pending','{\"city\": \"ETAWAH \", \"name\": \"ABHISHEK PRAJAPATI\", \"phone\": \"+919027874600\", \"state\": \"UTTER PRADESH \", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"ap869533@gmail.com\", \"address_line2\": null}',NULL,'2026-05-19 10:10:59','2026-05-19 10:10:59'),(16,'BJ-MPCIXNJU-KH7N',17,8,4499.00,0.00,0.00,809.82,5308.82,NULL,'cod','pending',NULL,'pending','{\"city\": \"ETAWAH \", \"name\": \"ABHISHEK PRAJAPATI\", \"phone\": \"+919027874600\", \"state\": \"UTTER PRADESH \", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"ap869533@gmail.com\", \"address_line2\": null}',NULL,'2026-05-19 11:02:45','2026-05-19 11:02:45'),(17,'BJ-MPCKZ9RF-0G79',17,8,1399.00,0.00,0.00,251.82,1650.82,NULL,'cod','pending',NULL,'pending','{\"city\": \"ETAWAH \", \"name\": \"ABHISHEK PRAJAPATI\", \"phone\": \"+919027874600\", \"state\": \"UTTER PRADESH \", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"ap869533@gmail.com\", \"address_line2\": null}',NULL,'2026-05-19 12:00:00','2026-05-19 12:00:00'),(18,'BJ-MPCLPVIA-VZIP',17,8,3299.00,200.00,0.00,557.82,3656.82,1,'razorpay','paid',NULL,'pending','{\"city\": \"ETAWAH \", \"name\": \"ABHISHEK PRAJAPATI\", \"phone\": \"+919027874600\", \"state\": \"UTTER PRADESH \", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"ap869533@gmail.com\", \"address_line2\": null}',NULL,'2026-05-19 12:21:36','2026-05-19 12:21:36'),(19,'BJ-MPCLXHT7-N5D9',17,8,13998.00,0.00,0.00,2519.64,16517.64,NULL,'razorpay','paid',NULL,'pending','{\"city\": \"ETAWAH \", \"name\": \"ABHISHEK PRAJAPATI\", \"phone\": \"+919027874600\", \"state\": \"UTTER PRADESH \", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"ap869533@gmail.com\", \"address_line2\": null}',NULL,'2026-05-19 12:27:06','2026-05-19 12:27:06'),(20,'BJ-MPCUWX8C-2EIW',17,8,10895.00,0.00,0.00,1961.10,12856.10,NULL,'cod','pending',NULL,'pending','{\"city\": \"ETAWAH \", \"name\": \"ABHISHEK PRAJAPATI\", \"phone\": \"+919027874600\", \"state\": \"UTTER PRADESH \", \"country\": \"India\", \"pincode\": \"206127\", \"address_line1\": \"ap869533@gmail.com\", \"address_line2\": null}',NULL,'2026-05-19 16:38:07','2026-05-19 16:38:07');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_otps`
--

DROP TABLE IF EXISTS `password_reset_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(191) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `attempts` int NOT NULL DEFAULT '0',
  `verified_at` datetime DEFAULT NULL,
  `consumed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_password_reset_email` (`email`),
  KEY `idx_password_reset_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_otps`
--

LOCK TABLES `password_reset_otps` WRITE;
/*!40000 ALTER TABLE `password_reset_otps` DISABLE KEYS */;
INSERT INTO `password_reset_otps` VALUES (1,17,'ap869533@gmail.com','$2a$10$gLTiHaAyRTOKWyJZd.o6QOcJtWDhJrArTYFX/d0e3LCMgTi8BsszG','2026-05-19 12:51:41',0,NULL,'2026-05-19 12:49:45','2026-05-19 12:41:41'),(2,17,'ap869533@gmail.com','$2a$10$7Q3epaOOYSt.XhdVlCzpK.ByPAkplhSorpVlBqwDx5BOj7Hrx41tK','2026-05-19 12:59:45',0,NULL,'2026-05-19 12:55:34','2026-05-19 12:49:45'),(3,17,'ap869533@gmail.com','$2a$10$EBvD.MOwAty68kxbs3mMUOBkhgJcGuhnFpKREjCz7ZDgYQXapVV1u','2026-05-19 13:05:34',0,NULL,'2026-05-19 12:55:42','2026-05-19 12:55:34'),(4,17,'ap869533@gmail.com','$2a$10$9dWJ5UQtddoSSS3.xaKGJeKBiFICtSyV8xzSuUU1AAqKXtHg6WUvW','2026-05-19 13:05:42',0,NULL,'2026-05-19 12:56:24','2026-05-19 12:55:42'),(5,17,'ap869533@gmail.com','$2a$10$Kcjml/P36ltFxavpL7nJYeLgoCCO7Cl55AFmcbkL9SsfnWmPD6Sb.','2026-05-19 13:06:25',0,NULL,'2026-05-19 13:01:43','2026-05-19 12:56:24'),(6,17,'ap869533@gmail.com','$2a$10$N4L2UXkFgFISqdy7Mviy6uqYPUHrVtiI.Zs85zaE1Wm9eOTQE4xDy','2026-05-19 13:11:43',0,NULL,'2026-05-19 13:05:30','2026-05-19 13:01:43'),(7,17,'ap869533@gmail.com','$2a$10$Pz2EwMOiidXXZO/VG66b2..Qc4h.mJAQximUncWuEJqdl/3tn/X6y','2026-05-19 13:15:30',0,NULL,'2026-05-19 13:23:12','2026-05-19 13:05:30'),(8,17,'ap869533@gmail.com','$2a$10$BahgL1STQ0QXObl7//HR9OCv.AI6mdJRzVxY45m95nqY1N3iKQRHe','2026-05-19 13:33:13',0,NULL,'2026-05-19 13:24:12','2026-05-19 13:23:13'),(9,17,'ap869533@gmail.com','$2a$10$Jy7tz3WxHH75OoCDbMy5VedccaitjRaI6F.A9SlxKrIK.6Su8FBDe','2026-05-19 13:34:13',0,NULL,'2026-05-19 13:30:06','2026-05-19 13:24:12'),(10,17,'ap869533@gmail.com','$2a$10$mVQYE1DZFgQ87.HZ/WHeWOBDgyv0iGQmgfsbmlAD/vBX5ghm.H/v6','2026-05-19 13:40:06',0,NULL,'2026-05-19 13:30:31','2026-05-19 13:30:06'),(11,17,'ap869533@gmail.com','$2a$10$480n949bfzJFmVbimxR7..x9Mg67n8c.fKgPoxpxL3Yr8nPXNMa1y','2026-05-19 13:40:31',0,NULL,'2026-05-19 14:22:39','2026-05-19 13:30:31'),(12,17,'ap869533@gmail.com','$2a$10$qqNdMtslXjaxTCEbmaVjaez6LHl1sjXmJbrsZHNfGxSIvNfl994Mu','2026-05-19 14:32:40',0,NULL,'2026-05-19 15:03:12','2026-05-19 14:22:39'),(13,17,'ap869533@gmail.com','$2a$10$6sptYe.OZFTzIj812dgW7Op6o.P8oZnzCLl7FvsGOeizvLC6Ld.zq','2026-05-19 15:13:13',0,NULL,'2026-05-19 15:07:59','2026-05-19 15:03:12'),(14,17,'ap869533@gmail.com','$2a$10$JNdgwKnLCvfgjs3Fs/plBO9k8Bz6iFPMScGRz/3vk09AGJuYVudKW','2026-05-19 15:17:59',0,NULL,'2026-05-19 15:09:37','2026-05-19 15:07:59'),(15,17,'ap869533@gmail.com','$2a$10$NwMMyUUndkaCWwrwlvDose4MhlY2sYDMzeqROvWKCU9CP8j51Ym9S','2026-05-19 15:19:37',0,NULL,'2026-05-19 15:19:16','2026-05-19 15:09:37'),(16,17,'ap869533@gmail.com','$2a$10$AUPL08gKYk7jSMjPjI0vSeATG3Qdol94/dv21cOmQ2Mgez18gw5kK','2026-05-19 15:29:17',0,'2026-05-19 15:21:08','2026-05-19 15:21:08','2026-05-19 15:19:16');
/*!40000 ALTER TABLE `password_reset_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80','Floral Anarkali Kurta Front',1,0,'2026-04-15 05:48:30'),(2,1,'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80','Floral Anarkali Kurta Side',0,1,'2026-04-15 05:48:30'),(3,1,'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80','Floral Anarkali Kurta Detail',0,2,'2026-04-15 05:48:30'),(4,2,'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80','Embroidered Straight Kurta',1,0,'2026-04-15 05:48:30'),(5,2,'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80','Embroidered Kurta Detail',0,1,'2026-04-15 05:48:30'),(6,3,'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80','Bandhani Print Kurti',1,0,'2026-04-15 05:48:30'),(7,3,'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80','Bandhani Detail',0,1,'2026-04-15 05:48:30'),(8,4,'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80','Chikankari White Kurta',1,0,'2026-04-15 05:48:30'),(9,4,'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80','Chikankari Embroidery Detail',0,1,'2026-04-15 05:48:30'),(10,5,'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80','Maxi Boho Floral Dress',1,0,'2026-04-15 05:48:30'),(11,5,'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80','Maxi Dress Side View',0,1,'2026-04-15 05:48:30'),(12,5,'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80','Maxi Dress Back View',0,2,'2026-04-15 05:48:30'),(13,6,'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80','Wrap Midi Dress',1,0,'2026-04-15 05:48:30'),(14,6,'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80','Wrap Dress Detail',0,1,'2026-04-15 05:48:30'),(15,7,'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80','Embroidered Boho Crop Top',1,0,'2026-04-15 05:48:30'),(16,7,'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&q=80','Crop Top Embroidery Detail',0,1,'2026-04-15 05:48:30'),(17,8,'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80','Off Shoulder Sundress',1,0,'2026-04-15 05:48:30'),(18,8,'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80','Sundress Side View',0,1,'2026-04-15 05:48:30'),(19,9,'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&q=80','Puff Sleeve Blouse',1,0,'2026-04-15 05:48:30'),(20,9,'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80','Blouse Back Detail',0,1,'2026-04-15 05:48:30'),(21,10,'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80','Tie-Dye Co-ord Set',1,0,'2026-04-15 05:48:30'),(22,10,'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80','Tie-Dye Set Detail',0,1,'2026-04-15 05:48:30'),(23,11,'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80','Printed Shirt Palazzo',1,0,'2026-04-15 05:48:30'),(24,11,'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80','Co-ord Set Detail',0,1,'2026-04-15 05:48:30'),(25,12,'https://images.unsplash.com/photo-1594938298603-c8148c4b4a7e?w=800&q=80','High Waist Printed Palazzo',1,0,'2026-04-15 05:48:30'),(26,12,'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80','Palazzo Detail',0,1,'2026-04-15 05:48:30'),(27,13,'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80','Flared Mirror Work Skirt',1,0,'2026-04-15 05:48:30'),(28,13,'https://images.unsplash.com/photo-1594938298603-c8148c4b4a7e?w=800&q=80','Skirt Mirror Detail',0,1,'2026-04-15 05:48:30'),(29,14,'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80','Banarasi Silk Dupatta',1,0,'2026-04-15 05:48:30'),(30,14,'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80','Banarasi Zari Border Detail',0,1,'2026-04-15 05:48:30'),(31,15,'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80','Phulkari Embroidered Dupatta',1,0,'2026-04-15 05:48:30'),(32,15,'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80','Phulkari Thread Detail',0,1,'2026-04-15 05:48:30'),(33,16,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80','Oxidized Silver Jhumka',1,0,'2026-04-15 05:48:30'),(34,16,'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80','Jhumka Close-up',0,1,'2026-04-15 05:48:30'),(35,17,'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80','Kundan Choker Necklace',1,0,'2026-04-15 05:48:30'),(36,17,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80','Kundan Set Complete',0,1,'2026-04-15 05:48:30'),(37,18,'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80','Chiffon Printed Stole',1,0,'2026-04-15 05:48:30'),(38,19,'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80','Kanjivaram Silk Saree Emerald',1,0,'2026-04-15 05:48:30'),(39,19,'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80','Kanjivaram Zari Border',0,1,'2026-04-15 05:48:30'),(40,19,'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80','Kanjivaram Pallu Detail',0,2,'2026-04-15 05:48:30'),(41,20,'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80','Mysore Crepe Silk Saree',1,0,'2026-04-15 05:48:30'),(42,20,'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80','Mysore Silk Border',0,1,'2026-04-15 05:48:30'),(43,21,'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80','Chanderi Silk Saree',1,0,'2026-04-15 05:48:30'),(44,21,'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80','Chanderi Booti Detail',0,1,'2026-04-15 05:48:30'),(45,22,'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80','Kalamkari Cotton Saree',1,0,'2026-04-15 05:48:30'),(46,22,'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80','Kalamkari Art Detail',0,1,'2026-04-15 05:48:30'),(47,23,'/uploads/c14a7efd-18b2-46ab-9b11-0af247e03258.jpg',NULL,1,0,'2026-04-15 07:49:59');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  `price_modifier` decimal(10,2) DEFAULT '0.00',
  `stock_quantity` int DEFAULT '0',
  `sku` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'Size','S',0.00,8,'EBP-ANK-001-S','2026-04-15 05:48:30'),(2,1,'Size','M',0.00,12,'EBP-ANK-001-M','2026-04-15 05:48:30'),(3,1,'Size','L',0.00,14,'EBP-ANK-001-L','2026-04-15 05:48:30'),(4,1,'Size','XL',0.00,8,'EBP-ANK-001-XL','2026-04-15 05:48:30'),(5,1,'Size','XXL',100.00,3,'EBP-ANK-001-XXL','2026-04-15 05:48:30'),(6,5,'Size','XS',0.00,5,'BCS-MXD-001-XS','2026-04-15 05:48:30'),(7,5,'Size','S',0.00,10,'BCS-MXD-001-S','2026-04-15 05:48:30'),(8,5,'Size','M',0.00,15,'BCS-MXD-001-M','2026-04-15 05:48:30'),(9,5,'Size','L',0.00,15,'BCS-MXD-001-L','2026-04-15 05:48:30'),(10,5,'Size','XL',0.00,10,'BCS-MXD-001-XL','2026-04-15 05:48:30'),(11,10,'Size','S',0.00,8,'DV-CORD-001-S','2026-04-15 05:48:30'),(12,10,'Size','M',0.00,10,'DV-CORD-001-M','2026-04-15 05:48:30'),(13,10,'Size','L',0.00,10,'DV-CORD-001-L','2026-04-15 05:48:30'),(14,10,'Size','XL',0.00,7,'DV-CORD-001-XL','2026-04-15 05:48:30'),(15,12,'Size','S (26-28 inch)',0.00,15,'DV-PAL-003-S','2026-04-15 05:48:30'),(16,12,'Size','M (30-32 inch)',0.00,20,'DV-PAL-003-M','2026-04-15 05:48:30'),(17,12,'Size','L (34-36 inch)',0.00,18,'DV-PAL-003-L','2026-04-15 05:48:30'),(18,12,'Size','XL (38-40 inch)',0.00,12,'DV-PAL-003-XL','2026-04-15 05:48:30'),(19,7,'Size','XS',0.00,10,'BCS-CRP-003-XS','2026-04-15 05:48:30'),(20,7,'Size','S',0.00,20,'BCS-CRP-003-S','2026-04-15 05:48:30'),(21,7,'Size','M',0.00,25,'BCS-CRP-003-M','2026-04-15 05:48:30'),(22,7,'Size','L',0.00,15,'BCS-CRP-003-L','2026-04-15 05:48:30');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `vendor_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text,
  `short_description` varchar(500) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `manage_stock` tinyint(1) DEFAULT '1',
  `allow_backorder` tinyint(1) DEFAULT '0',
  `weight` decimal(8,2) DEFAULT NULL,
  `fabric` varchar(100) DEFAULT NULL,
  `care_instructions` text,
  `brand` varchar(100) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `status` enum('draft','pending','published','rejected','archived') DEFAULT 'pending',
  `is_featured` tinyint(1) DEFAULT '0',
  `views` int DEFAULT '0',
  `rating` decimal(3,2) DEFAULT '0.00',
  `total_reviews` int DEFAULT '0',
  `total_sold` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_vendor` (`vendor_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`is_featured`),
  FULLTEXT KEY `idx_search` (`name`,`description`,`short_description`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'bb644a7d-388e-11f1-b12b-f854f6b8a864',2,1,'Floral Anarkali Kurta with Dupatta','floral-anarkali-kurta-dupatta','A stunning Anarkali kurta in soft cotton with hand-block printed florals. Paired with a matching printed dupatta. Perfect for festive occasions and family gatherings. The flared silhouette flatters all body types and moves beautifully. Finished with intricate mirror work at the neckline.','Hand-block printed floral Anarkali with mirror work neckline & matching dupatta.','EBP-ANK-001',2499.00,1899.00,NULL,37,1,0,NULL,'Cotton Cambric','Gentle hand wash or dry clean. Do not bleach. Iron on medium heat.','Ethnic by Priya','[\"anarkali\", \"kurta\", \"festive\", \"floral\", \"cotton\", \"ethnic\", \"dupatta\"]','published',1,2,4.00,1,86,'2026-04-15 05:48:30','2026-05-19 16:38:07'),(2,'bb665b98-388e-11f1-b12b-f854f6b8a864',2,1,'Embroidered Straight Kurta Set','embroidered-straight-kurta-set','Elegant straight-cut kurta with rich thread embroidery along the neckline and sleeves. Comes with matching palazzo pants and dupatta. Made from premium Chanderi fabric with a beautiful sheen. The intricate embroidery is done by skilled artisans from Lucknow.','Premium Chanderi kurta with Lucknawi embroidery, palazzo & dupatta set.','EBP-STR-002',3299.00,NULL,NULL,28,1,0,NULL,'Chanderi Silk','Dry clean only. Store in a cool, dry place.','Ethnic by Priya','[\"kurta\", \"embroidery\", \"chanderi\", \"palazzo\", \"set\", \"lucknawi\"]','published',0,8,4.50,18,44,'2026-04-15 05:48:30','2026-05-19 16:38:07'),(3,'bb66a672-388e-11f1-b12b-f854f6b8a864',2,1,'Bandhani Print Kurti with Pants','bandhani-print-kurti-pants','Traditional Bandhani tie-dye art in vibrant colors on a comfortable cotton kurti. Paired with cigarette pants. The Bandhani print is authentic, sourced from Jaipur artisans. Lightweight and perfect for daily wear or casual outings.','Authentic Jaipur Bandhani kurti with cigarette pants. Vibrant & comfortable.','EBP-BAN-003',1799.00,1399.00,NULL,58,1,0,NULL,'Pure Cotton','Machine wash cold. Do not wring. Dry in shade.','Ethnic by Priya','[\"bandhani\", \"kurti\", \"jaipur\", \"casual\", \"cotton\", \"daily wear\"]','published',1,2,4.40,22,97,'2026-04-15 05:48:30','2026-05-19 12:00:00'),(4,'bb66b6ee-388e-11f1-b12b-f854f6b8a864',2,1,'Chikankari White Kurta','chikankari-white-kurta','Classic white Chikankari kurta with delicate hand-embroidered motifs. A timeless piece that works for both formal and casual settings. The Chikankari work is authentic Lucknawi craftsmanship passed down through generations. Pairs beautifully with any bottom wear.','Authentic Lucknawi Chikankari hand-embroidered white kurta. Timeless elegance.','EBP-CHK-004',2199.00,NULL,NULL,25,1,0,NULL,'Georgette','Gentle hand wash only. Do not tumble dry.','Ethnic by Priya','[\"chikankari\", \"white\", \"kurta\", \"lucknawi\", \"embroidery\", \"formal\"]','published',0,0,4.80,41,67,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(5,'bb68d99f-388e-11f1-b12b-f854f6b8a864',3,2,'Maxi Boho Floral Dress','maxi-boho-floral-dress','Effortlessly beautiful maxi dress with an all-over floral print. Features a V-neckline, flowy silhouette and tiered hem. Made from lightweight chiffon that moves with you. Perfect for beach days, brunches, or boho-style festivals. Available in multiple color combinations.','Flowy V-neck floral maxi dress in lightweight chiffon. Beach & festival perfect.','BCS-MXD-001',2199.00,1699.00,NULL,53,1,0,NULL,'Chiffon','Hand wash cold. Hang dry. Iron on low heat.','Boho Chic Store','[\"maxi\", \"dress\", \"floral\", \"boho\", \"chiffon\", \"beach\", \"festival\"]','published',1,0,5.00,1,145,'2026-04-15 05:48:30','2026-04-15 12:56:32'),(6,'bb68fdd4-388e-11f1-b12b-f854f6b8a864',3,2,'Wrap Midi Dress with Belt','wrap-midi-dress-belt','Classic wrap-style midi dress with adjustable tie belt. The wrap design is universally flattering and the midi length is perfectly versatile. Made from sustainable viscose fabric in an earthy abstract print. Dress up with heels or dress down with sandals.','Flattering wrap midi dress in sustainable viscose. Comes with matching tie belt.','BCS-WRP-002',2799.00,NULL,NULL,38,1,0,NULL,'Viscose Crepe','Machine wash gentle. Do not bleach. Low iron.','Boho Chic Store','[\"midi\", \"dress\", \"wrap\", \"sustainable\", \"viscose\", \"versatile\"]','published',0,0,4.60,29,58,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(7,'bb690662-388e-11f1-b12b-f854f6b8a864',3,3,'Embroidered Boho Crop Top','embroidered-boho-crop-top','Free-spirited crop top with colorful thread embroidery across the chest. The peasant-style neckline and balloon sleeves give it an authentic boho feel. Pairs perfectly with high-waist palazzos or wide-leg jeans. Made from soft cotton with a relaxed fit.','Boho crop top with colorful chest embroidery & balloon sleeves. Pairs with palazzos.','BCS-CRP-003',1299.00,999.00,NULL,70,1,0,NULL,'Cotton','Machine wash cold. Dry flat to maintain shape.','Boho Chic Store','[\"crop top\", \"boho\", \"embroidery\", \"cotton\", \"casual\", \"festive\"]','published',1,0,5.00,1,112,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(8,'bb690d9b-388e-11f1-b12b-f854f6b8a864',3,2,'Off-Shoulder Tiered Sundress','off-shoulder-tiered-sundress','Romantic off-shoulder sundress with three tiers of ruffles. The elastic neckline can be worn on or off the shoulder for versatile styling. In a delicate floral print on a cream base. Perfect for summer days and vacations. Lightweight and easy to pack.','Romantic off-shoulder ruffled tiered dress. Cream floral print. Summer essential.','BCS-SND-004',1899.00,1499.00,NULL,48,1,0,NULL,'Cotton Voile','Hand wash cold. Dry in shade to preserve colors.','Boho Chic Store','[\"off-shoulder\", \"sundress\", \"tiered\", \"ruffles\", \"summer\", \"floral\"]','published',1,0,4.80,53,98,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(9,'bb69147f-388e-11f1-b12b-f854f6b8a864',3,3,'Printed Puff Sleeve Blouse','printed-puff-sleeve-blouse','Trendy puff-sleeve blouse in a bold geometric print. The structured puff sleeves add drama while the relaxed body keeps it comfortable. Features a subtle keyhole back with a button closure. Style with sarees, skirts, or trousers for a modern-ethnic look.','Bold geometric print blouse with dramatic puff sleeves. Modern-ethnic versatility.','BCS-BLS-005',1499.00,NULL,NULL,42,1,0,NULL,'Cotton Silk Blend','Dry clean recommended. Steam iron on low.','Boho Chic Store','[\"blouse\", \"puff sleeve\", \"geometric\", \"modern\", \"ethnic\", \"trendy\"]','published',0,0,4.50,31,74,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(10,'bb6a0155-388e-11f1-b12b-f854f6b8a864',4,5,'Tie-Dye Co-ord Set','tie-dye-co-ord-set','Trendy tie-dye matching set featuring a bralette top and wide-leg pants. The vibrant tie-dye pattern is hand-dyed, making each piece unique. Perfect for beachside vacations or casual hangouts. The set is fully lined and the fabric is breathable for Indian summers.','Hand-dyed tie-dye bralette + wide-leg pants set. Each piece uniquely yours.','DV-CORD-001',2499.00,1999.00,NULL,30,1,0,NULL,'Rayon','Hand wash separately. Colors may bleed slightly initially.','Desi Vibes','[\"co-ord\", \"tie-dye\", \"set\", \"beach\", \"casual\", \"rayon\", \"wide-leg\"]','published',1,4,4.00,1,87,'2026-04-15 05:48:30','2026-04-16 12:03:36'),(11,'bb6a1178-388e-11f1-b12b-f854f6b8a864',4,5,'Printed Shirt and Palazzo Co-ord','printed-shirt-palazzo-co-ord','Matching printed shirt and palazzo set in a stunning block-print pattern. The oversized shirt can be tucked in, left out, or knotted at the waist for multiple looks. The palazzo provides maximum comfort and the pair makes a complete ready-to-wear outfit.','Block-print shirt + palazzo combo. Style 3 ways. Complete ready-to-wear look.','DV-CORD-002',2899.00,NULL,NULL,28,1,0,NULL,'Linen Blend','Machine wash gentle cycle. Hang dry.','Desi Vibes','[\"co-ord\", \"block print\", \"shirt\", \"palazzo\", \"linen\", \"versatile\"]','published',0,0,4.40,19,44,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(12,'bb6a16aa-388e-11f1-b12b-f854f6b8a864',4,4,'High-Waist Printed Palazzo','high-waist-printed-palazzo','Comfortable high-waist palazzo pants in a vibrant Ikat print. The wide-leg silhouette is flattering and the elasticated waistband ensures all-day comfort. Pairs beautifully with kurtis, crop tops, or simple white shirts. Made from breathable cotton for Indian climates.','Vibrant Ikat printed high-waist palazzo. Elasticated waist for all-day comfort.','DV-PAL-003',1199.00,899.00,NULL,65,1,0,NULL,'Cotton','Machine wash. Dry in shade to preserve print.','Desi Vibes','[\"palazzo\", \"ikat\", \"high-waist\", \"cotton\", \"comfortable\", \"ethnic\"]','published',1,2,5.00,1,134,'2026-04-15 05:48:30','2026-04-15 05:51:40'),(13,'bb6a1b5a-388e-11f1-b12b-f854f6b8a864',4,4,'Flared Skirt with Mirror Work','flared-skirt-mirror-work','Beautiful A-line flared skirt adorned with intricate mirror work at the hem. The tiered construction gives it volume and movement. In a rich burgundy with gold mirror details. Pairs wonderfully with ethnic or fusion tops. Perfect for Navratri, festivals, and celebrations.','Tiered A-line skirt with hand-done mirror work. Navratri & festival perfect.','DV-SKT-004',1899.00,1599.00,NULL,40,1,0,NULL,'Rayon','Gentle hand wash. Do not wring. Dry in shade.','Desi Vibes','[\"skirt\", \"mirror work\", \"flared\", \"navratri\", \"festival\", \"ethnic\"]','published',0,0,4.50,27,63,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(14,'bb6b0f7a-388e-11f1-b12b-f854f6b8a864',5,6,'Banarasi Silk Dupatta Gold Border','banarasi-silk-dupatta-gold-border','Exquisite Banarasi silk dupatta with a rich zari border and intricate buta motifs woven throughout. The gold zari work catches light beautifully. A must-have accessory to elevate any ethnic outfit. Comes in a signature gift box, perfect as a present.','Authentic Banarasi silk dupatta with gold zari border. Elevates any ethnic look.','RW-DUP-001',3499.00,NULL,NULL,21,1,0,NULL,'Pure Banarasi Silk','Dry clean only. Store in muslin cloth.','Royal Weaves','[\"dupatta\", \"banarasi\", \"silk\", \"zari\", \"gold\", \"wedding\", \"festive\"]','published',1,2,5.00,1,157,'2026-04-15 05:48:30','2026-04-15 07:12:12'),(15,'bb6b2209-388e-11f1-b12b-f854f6b8a864',5,6,'Phulkari Embroidered Dupatta','phulkari-embroidered-dupatta','Vibrant Phulkari dupatta from Punjab with dense, colorful thread embroidery covering the entire surface. Each Phulkari piece is hand-embroidered by skilled artisans and takes weeks to complete. A cherished piece of Indian textile heritage.','Authentic Punjab Phulkari hand-embroidered dupatta. Dense colorful threadwork.','RW-DUP-002',2799.00,2399.00,NULL,18,1,0,NULL,'Cotton with Silk Thread','Dry clean only. Handle with care.','Royal Weaves','[\"phulkari\", \"dupatta\", \"embroidery\", \"punjab\", \"traditional\", \"heritage\"]','published',1,0,5.00,1,109,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(16,'bb6b276b-388e-11f1-b12b-f854f6b8a864',5,7,'Oxidized Silver Jhumka Earrings Set','oxidized-silver-jhumka-set','Traditional oxidized silver-finish jhumka earrings with intricate filigree work. The dangling beads and floral motifs make them a perfect accessory for ethnic and fusion outfits. Lightweight despite their bold appearance. Nickel-free and skin-friendly.','Oxidized silver jhumka earrings with filigree work. Lightweight & skin-friendly.','RW-JHK-003',799.00,649.00,NULL,80,1,0,NULL,'Brass with Silver Oxidized Finish','Wipe with soft dry cloth. Avoid water exposure.','Royal Weaves','[\"jhumka\", \"earrings\", \"oxidized\", \"silver\", \"ethnic\", \"jewelry\", \"accessories\"]','published',0,0,4.60,43,198,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(17,'bb6b2b65-388e-11f1-b12b-f854f6b8a864',5,7,'Kundan Choker Necklace Set','kundan-choker-necklace-set','Royal Kundan choker necklace set with matching earrings and maang tikka. Features green and red meenakari work on gold-plated base with Kundan stone settings. Perfect for weddings, sangeet, and festive occasions. Comes in a velvet gift box.','Kundan choker necklace with earrings & maang tikka. Perfect for weddings.','RW-KND-004',2499.00,1999.00,NULL,30,1,0,NULL,'Brass Gold Plated with Kundan','Keep dry. Store in provided velvet box.','Royal Weaves','[\"kundan\", \"choker\", \"necklace\", \"set\", \"wedding\", \"meenakari\", \"gold\"]','published',1,0,4.70,74,121,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(18,'bb6b2ebb-388e-11f1-b12b-f854f6b8a864',5,6,'Chiffon Printed Stole','chiffon-printed-stole','Lightweight chiffon stole with a beautiful paisley and floral digital print. Versatile enough to be worn as a dupatta, scarf, or beach cover-up. The feather-light fabric drapes elegantly. Pack a few in your travel bag as they take almost no space.','Lightweight chiffon paisley stole. Wear as dupatta, scarf, or beach cover-up.','RW-STL-005',899.00,699.00,NULL,90,1,0,NULL,'Chiffon','Gentle hand wash. Drip dry.','Royal Weaves','[\"stole\", \"chiffon\", \"printed\", \"paisley\", \"versatile\", \"travel\", \"dupatta\"]','published',0,0,4.40,28,86,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(19,'bb6bf058-388e-11f1-b12b-f854f6b8a864',6,8,'Kanjivaram Silk Saree - Emerald Green','kanjivaram-silk-saree-emerald','Authentic Kanjivaram silk saree in rich emerald green with a contrasting gold zari border and pallu. The traditional temple border design and heavy zari work make this a prized possession. Woven on handlooms in Kanchipuram by master weavers. Comes with an unstitched blouse piece.','Authentic handloom Kanjivaram silk saree. Gold zari temple border. Blouse included.','SS-KNJ-001',14999.00,11999.00,NULL,12,1,0,NULL,'Pure Kanjivaram Silk','Dry clean only. Store wrapped in muslin cloth with neem leaves.','South Silks','[\"kanjivaram\", \"saree\", \"silk\", \"zari\", \"wedding\", \"bridal\", \"south indian\"]','published',1,0,5.00,1,67,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(20,'bb6c0050-388e-11f1-b12b-f854f6b8a864',6,8,'Mysore Crepe Silk Saree - Rose Pink','mysore-crepe-silk-saree-rose','Elegant Mysore crepe silk saree in soft rose pink with delicate silver border. Mysore silk is known for its soft texture and royal sheen. Lightweight and easy to drape. The minimal design makes it suitable for both formal occasions and casual festive wear. With matching blouse piece.','Soft Mysore crepe silk saree in rose pink. Lightweight & elegant. With blouse piece.','SS-MYS-002',8999.00,6999.00,NULL,16,1,0,NULL,'Mysore Crepe Silk','Dry clean only.','South Silks','[\"mysore\", \"silk\", \"saree\", \"crepe\", \"elegant\", \"formal\", \"pink\"]','published',1,0,4.70,56,45,'2026-04-15 05:48:30','2026-05-19 12:27:06'),(21,'bb6c0564-388e-11f1-b12b-f854f6b8a864',6,8,'Chanderi Silk Saree - Powder Blue','chanderi-silk-saree-powder-blue','Delicate Chanderi silk saree in powder blue with gold woven bootis throughout. Chanderi is known for its characteristic texture with a translucent appearance. The lightness of this fabric makes it extremely comfortable to wear. Perfect for day events and office parties.','Delicate Chanderi silk saree with gold bootis. Translucent & lightweight.','SS-CHN-003',5999.00,4499.00,NULL,24,1,0,NULL,'Chanderi Silk','Dry clean or gentle hand wash. Do not wring.','South Silks','[\"chanderi\", \"silk\", \"saree\", \"booti\", \"lightweight\", \"office\", \"blue\"]','published',0,2,4.60,34,55,'2026-04-15 05:48:30','2026-04-15 07:56:24'),(22,'bb6c08c6-388e-11f1-b12b-f854f6b8a864',6,8,'Kalamkari Printed Cotton Saree','kalamkari-printed-cotton-saree','Hand-painted Kalamkari art on soft cotton saree. Features traditional mythological motifs painted using natural dyes in the authentic Andhra Kalamkari style. Each saree is unique as it is entirely hand-painted by skilled artists. Comfortable for daily wear.','Hand-painted Kalamkari cotton saree with natural dyes. Each piece is unique.','SS-KAL-004',3499.00,2799.00,NULL,29,1,0,NULL,'Handloom Cotton','First wash separately. Gentle hand wash.','South Silks','[\"kalamkari\", \"cotton\", \"saree\", \"handpainted\", \"natural dyes\", \"daily wear\"]','published',0,4,4.50,41,78,'2026-04-15 05:48:30','2026-04-15 16:54:59'),(23,'e7903128-a917-4090-a9fa-84e1efeb8b9e',1,1,'kurti set new desine','kurti-set-new-desine-1776239399616','ovnhvooi hiohvoihvioo noihvonohv ohoinoivh .','klhoolhnolhoilkhn',NULL,5000.00,4499.00,NULL,9,1,0,NULL,NULL,NULL,NULL,NULL,'published',0,16,0.00,0,1,'2026-04-15 07:49:59','2026-05-19 12:28:43');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`(100)),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (4,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXVpZCI6Ijg3NjY4NDQ1LTRjN2YtNGMxYy04NDQ4LWI4NjZlNjgzMWViMCIsInJvbGUiOiJ2ZW5kb3IiLCJlbWFpbCI6InNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3NzYyMjk0NjMsImV4cCI6MTc3ODgyMTQ2M30.lwm8T1VN2M3ZAAuC2uRj0DFaQ1GmFYm9KOA4r_NIDMU','2026-05-15 05:04:23','2026-04-15 05:04:23'),(8,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXVpZCI6Ijg3NjY4NDQ1LTRjN2YtNGMxYy04NDQ4LWI4NjZlNjgzMWViMCIsInJvbGUiOiJ2ZW5kb3IiLCJlbWFpbCI6InNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3NzYyMzA4ODAsImV4cCI6MTc3ODgyMjg4MH0.EQkrus9W17phLTSWpI3bta9jW57PyTIh2vE0TGnP1Y4','2026-05-15 05:28:00','2026-04-15 05:28:00'),(9,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXVpZCI6ImJhYmU2M2E4LTE1ZmYtNDhlOS04Nzk3LWRlMzcwZTY4MTM3NyIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc3NjIzMjI1NSwiZXhwIjoxNzc4ODI0MjU1fQ.0_BckMXl7j30ID_RhyVZZiB2xQtKWxazTDpeUt3McPo','2026-05-15 05:50:56','2026-04-15 05:50:55'),(12,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXVpZCI6ImJhYmU2M2E4LTE1ZmYtNDhlOS04Nzk3LWRlMzcwZTY4MTM3NyIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc3NjIzMzI3MywiZXhwIjoxNzc4ODI1MjczfQ.WFYuY1eIzsSiKH5UjFTC8vmQ_IzUnIXbMlR01OVtpXQ','2026-05-15 06:07:53','2026-04-15 06:07:53'),(18,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXVpZCI6ImJhYmU2M2E4LTE1ZmYtNDhlOS04Nzk3LWRlMzcwZTY4MTM3NyIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc3NjIzNDQ4NywiZXhwIjoxNzc4ODI2NDg3fQ.WbQGsE3StFpsH9vlxLIs4EHoObUUYz1NjVFyRGgtcvc','2026-05-15 06:28:08','2026-04-15 06:28:07'),(35,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXVpZCI6ImJhYmU2M2E4LTE1ZmYtNDhlOS04Nzk3LWRlMzcwZTY4MTM3NyIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc3NjI1NTI5NywiZXhwIjoxNzc4ODQ3Mjk3fQ.vqwCD7lkCeo2Sw8OhOEBb5kZZ489LScgseyS6PokO8I','2026-05-15 12:14:58','2026-04-15 12:14:57'),(43,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXVpZCI6ImJhYmU2M2E4LTE1ZmYtNDhlOS04Nzk3LWRlMzcwZTY4MTM3NyIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc3NjI3MTg2OCwiZXhwIjoxNzc4ODYzODY4fQ.TXBqPwW8KBvnejrdUoh5mD8VqVd5hURGBJ7KnVT-moU','2026-05-15 16:51:08','2026-04-15 16:51:08'),(52,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXVpZCI6IjNlZDhmM2RjLTU2NzQtNGFhOS1hMjAxLTlkYmQxMDcwMzhhOSIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzc2MzIwMjE5LCJleHAiOjE3Nzg5MTIyMTl9.OZBJLg26Cv4ZfAeeIoEwdoUDiBQwHaC0JRN7_qSleO4','2026-05-16 06:17:00','2026-04-16 06:16:59'),(55,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXVpZCI6Ijg3NjY4NDQ1LTRjN2YtNGMxYy04NDQ4LWI4NjZlNjgzMWViMCIsInJvbGUiOiJ2ZW5kb3IiLCJlbWFpbCI6InNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3NzYzNDEwNTIsImV4cCI6MTc3ODkzMzA1Mn0.nfrKRrcobtcHxaT-pwppCSEmtPJsqlmpMmcz_ZSmHDQ','2026-05-16 12:04:12','2026-04-16 12:04:12'),(65,17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInV1aWQiOiJhN2Y1ZDgwNC03MGQwLTRhYmQtYjQ5MC1lY2ZhYzNkNGZlYTkiLCJyb2xlIjoidXNlciIsImVtYWlsIjoiYXA4Njk1MzNAZ21haWwuY29tIiwiaWF0IjoxNzc5MTg1MjU3LCJleHAiOjE3ODE3NzcyNTd9.V7jySuiSoRk9AqEwpEqYJfKd8snqAW35jJ8xAN0hU6E','2026-06-18 10:07:38','2026-05-19 10:07:37'),(66,17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInV1aWQiOiJhN2Y1ZDgwNC03MGQwLTRhYmQtYjQ5MC1lY2ZhYzNkNGZlYTkiLCJyb2xlIjoidXNlciIsImVtYWlsIjoiYXA4Njk1MzNAZ21haWwuY29tIiwiaWF0IjoxNzc5MTkyNTIxLCJleHAiOjE3ODE3ODQ1MjF9.AKsMh9FkIJi7gy0n49ob05u2QD-rbEspTBWEDYujrZs','2026-06-18 12:08:41','2026-05-19 12:08:41'),(67,17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInV1aWQiOiJhN2Y1ZDgwNC03MGQwLTRhYmQtYjQ5MC1lY2ZhYzNkNGZlYTkiLCJyb2xlIjoidXNlciIsImVtYWlsIjoiYXA4Njk1MzNAZ21haWwuY29tIiwiaWF0IjoxNzc5MjA4NjUxLCJleHAiOjE3ODE4MDA2NTF9.fK96_OxkZVDWdUokRPOyFNaH5Do_-Tr1sutPO6V5uAY','2026-06-18 16:37:31','2026-05-19 16:37:31');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `rating` int NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `comment` text,
  `images` json DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `is_approved` tinyint(1) DEFAULT '1',
  `helpful_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_review` (`user_id`,`product_id`,`order_id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_approved` (`is_approved`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,5,11,NULL,5,'Absolutely stunning!','This dress is everything I hoped for! The fabric is so lightweight and the floral print is gorgeous in person. Got so many compliments at the beach. Sizing is perfect, I ordered M and it fits like a dream. Will definitely order more pieces!',NULL,1,1,0,'2026-04-15 05:48:30'),(2,1,12,NULL,4,'Beautiful kurta, great quality','The Anarkali is really beautiful and the fabric feels premium. The mirror work at the neckline is exquisite. Only giving 4 stars because the delivery took a bit longer than expected. But the product itself is 5 stars!',NULL,0,1,0,'2026-04-15 05:48:30'),(3,19,16,NULL,5,'Heirloom quality saree','I bought this for my cousin s wedding and everyone wanted to know where I got it from. The zari work is incredible and the silk is genuinely heavy and rich. Worth every rupee. South Silks has earned a lifetime customer.',NULL,0,1,0,'2026-04-15 05:48:30'),(4,14,14,NULL,5,'Magnificent Banarasi work!','The craftsmanship on this dupatta is unbelievable. The gold zari border catches light beautifully. I paired it with a plain anarkali and it transformed the entire look. The gift box packaging was also very elegant.',NULL,0,1,0,'2026-04-15 05:48:30'),(5,7,13,NULL,5,'Festival must-have!','Wore this to a music festival and received so many compliments. The embroidery is really intricate and colorful. Paired it with high-waist palazzo and it was the perfect festival look. Fabric is comfortable too!',NULL,1,1,0,'2026-04-15 05:48:30'),(6,15,15,NULL,5,'Authentic Phulkari art','I have seen many Phulkari dupattas but this one is exceptional. The density of embroidery and the color combinations are stunning. I can see the hours of work that have gone into it. A true work of art.',NULL,0,1,0,'2026-04-15 05:48:30'),(7,10,11,NULL,4,'Unique and trendy!','Love the concept of each piece being unique due to hand-dyeing. My set has the most beautiful purple-teal combination. The fabric is soft and comfortable. The wide-leg pants are very flattering. Minor issue was the colors bled a tiny bit on first wash.',NULL,0,1,0,'2026-04-15 05:48:30'),(8,12,12,NULL,5,'Best palazzo ever!','I have been looking for the perfect Ikat palazzo for months. This is IT. The print is vibrant, the waist is comfortable and the fabric is breathable. Already ordered two more colors. Sizing chart is accurate.',NULL,0,1,0,'2026-04-15 05:48:30');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `setting_type` varchar(50) DEFAULT 'string',
  `description` varchar(300) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'site_name','BohoJazz','string','Website name','2026-04-14 11:50:53'),(2,'site_tagline','Classic · Contemporary · Fusion','string','Website tagline','2026-04-14 11:50:53'),(3,'site_email','hello@bohojazz.com','string','Contact email','2026-04-14 11:50:53'),(4,'site_phone','+91-9876543210','string','Contact phone','2026-04-14 11:50:53'),(5,'default_commission','10','number','Default vendor commission %','2026-04-14 11:50:53'),(6,'free_shipping_above','999','number','Free shipping above this amount','2026-04-14 11:50:53'),(7,'shipping_charge','99','number','Standard shipping charge','2026-04-14 11:50:53'),(8,'currency','INR','string','Currency code','2026-04-14 11:50:53'),(9,'currency_symbol','₹','string','Currency symbol','2026-04-14 11:50:53');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','vendor','user') DEFAULT 'user',
  `status` enum('active','inactive','banned') DEFAULT 'active',
  `email_verified` tinyint(1) DEFAULT '0',
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'30fce439-37f8-11f1-b12b-f854f6b8a864','BohoJazz Admin','admin@bohojazz.com','$2a$12$LqKMTIi/RKPZ7mRyJMn5yOJcFYlxFkEQJL3FzZxrJRMRSiJb2vKy',NULL,'admin','active',1,NULL,'2026-04-14 11:50:53','2026-04-15 05:15:33'),(2,'558bb01f-c993-4b6e-adea-cf865d3647c5','ABHISHEK PRAJAPATI','ap86953@gmail.com','$2a$12$y0Is8wkUuEhw7SyvD.8K8eq3vgxU.Fy0mZBx5AwZTMdI7Xofy5hRW','+919027874601','user','active',0,NULL,'2026-04-14 12:39:22','2026-04-14 12:39:22'),(3,'babe63a8-15ff-48e9-8797-de370e681377','user','user@gmail.com','$2a$12$exM1HLvzx1KYbAYPRpkXNebC3Yz4PILePwj3xDgFNKRTlCmRyBpoe','3265893265','user','active',0,NULL,'2026-04-14 12:44:01','2026-04-14 12:44:01'),(4,'87668445-4c7f-4c1c-8448-b866e6831eb0','seller','seller@gmail.com','$2a$12$.no9WFR2jMUU5yAYwI1/jeqeRA24OLQl930KKvZEHkK9bOI5.kqpe','8965327854','vendor','active',0,NULL,'2026-04-14 12:57:55','2026-04-14 12:57:55'),(5,'3ed8f3dc-5674-4aa9-a201-9dbd107038a9','Admin','admin@gmail.com','$2a$12$up6GJ9iE5z7zPBKeMbQ5lOUX3/s2fb3g0H9aUFpILRo9b8LKPq8mW','6546516846','admin','active',0,NULL,'2026-04-15 05:10:45','2026-04-15 05:11:26'),(6,'bb578cbd-388e-11f1-b12b-f854f6b8a864','Priya Sharma','priya@ethnicbypriya.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876501001','vendor','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(7,'bb5aa89d-388e-11f1-b12b-f854f6b8a864','Riya Gupta','riya@bohochicstore.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876501002','vendor','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(8,'bb5ab2c4-388e-11f1-b12b-f854f6b8a864','Meera Patel','meera@desivibes.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876501003','vendor','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(9,'bb5ab7fe-388e-11f1-b12b-f854f6b8a864','Anjali Singh','anjali@royalweaves.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876501004','vendor','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(10,'bb5abaf3-388e-11f1-b12b-f854f6b8a864','Kavya Nair','kavya@southsilks.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876501005','vendor','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(11,'bb5cb29f-388e-11f1-b12b-f854f6b8a864','Neha Verma','neha@gmail.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876502001','user','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 11:15:12'),(12,'bb5cbf0f-388e-11f1-b12b-f854f6b8a864','Pooja Joshi','pooja@gmail.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876502002','user','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(13,'bb5cc1c3-388e-11f1-b12b-f854f6b8a864','Sunita Rao','sunita@gmail.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876502003','user','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(14,'bb5cc3f8-388e-11f1-b12b-f854f6b8a864','Divya Menon','divya@gmail.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876502004','user','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(15,'bb5cc5fe-388e-11f1-b12b-f854f6b8a864','Aisha Khan','aisha@gmail.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876502005','user','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(16,'bb5cc803-388e-11f1-b12b-f854f6b8a864','Shreya Das','shreya@gmail.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uHhlRCdnm','9876502006','user','active',1,NULL,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(17,'a7f5d804-70d0-4abd-b490-ecfac3d4fea9','ABHISHEK PRAJAPATI','ap869533@gmail.com','$2a$12$1BK9TrRxa.OnJkXSQmF5vuL0Tyq1EQ0WCKYgf4LOoQwmojCdBAXde','+919027874600','user','active',0,NULL,'2026-05-19 07:11:16','2026-05-19 09:51:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_payouts`
--

DROP TABLE IF EXISTS `vendor_payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_payouts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendor_id` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','processing','paid','failed') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(200) DEFAULT NULL,
  `notes` text,
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_vendor` (`vendor_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `vendor_payouts_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_payouts`
--

LOCK TABLES `vendor_payouts` WRITE;
/*!40000 ALTER TABLE `vendor_payouts` DISABLE KEYS */;
INSERT INTO `vendor_payouts` VALUES (1,3,8500.00,'paid','bank_transfer',NULL,'ICICI Bank - 4521xxxxx','2026-04-15 05:48:30','2026-04-05 05:48:30'),(2,6,22000.00,'paid','bank_transfer',NULL,'SBI - 7832xxxxx','2026-04-15 05:48:30','2026-04-08 05:48:30'),(3,5,12500.00,'paid','bank_transfer',NULL,NULL,'2026-04-15 05:48:30','2026-04-15 17:00:13'),(4,2,6800.00,'paid','bank_transfer','KNOIS',NULL,'2026-04-15 05:48:30','2026-04-15 11:17:28');
/*!40000 ALTER TABLE `vendor_payouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_profiles`
--

DROP TABLE IF EXISTS `vendor_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `shop_name` varchar(150) NOT NULL,
  `shop_slug` varchar(150) NOT NULL,
  `shop_description` text,
  `shop_logo` varchar(255) DEFAULT NULL,
  `shop_banner` varchar(255) DEFAULT NULL,
  `business_email` varchar(150) DEFAULT NULL,
  `business_phone` varchar(20) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `gst_number` varchar(20) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `bank_account` varchar(30) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `commission_rate` decimal(5,2) DEFAULT '10.00',
  `is_approved` tinyint(1) DEFAULT '0',
  `approved_at` timestamp NULL DEFAULT NULL,
  `total_sales` decimal(12,2) DEFAULT '0.00',
  `rating` decimal(3,2) DEFAULT '0.00',
  `total_reviews` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_slug` (`shop_slug`),
  KEY `user_id` (`user_id`),
  KEY `idx_shop_slug` (`shop_slug`),
  KEY `idx_approved` (`is_approved`),
  CONSTRAINT `vendor_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_profiles`
--

LOCK TABLES `vendor_profiles` WRITE;
/*!40000 ALTER TABLE `vendor_profiles` DISABLE KEYS */;
INSERT INTO `vendor_profiles` VALUES (1,4,'seller\'s Shop','seller-1776171475541',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.00,1,'2026-04-15 05:13:17',0.00,0.00,0,'2026-04-14 12:57:55','2026-04-15 05:13:16'),(2,6,'Ethnic by Priya','ethnic-by-priya','Handcrafted ethnic wear blending traditional Indian artistry with contemporary silhouettes. Each piece tells a story.',NULL,NULL,'priya@ethnicbypriya.com','9876501001','42, Lajpat Nagar Market','New Delhi','Delhi','110024',NULL,NULL,NULL,NULL,NULL,10.00,1,'2026-04-15 16:58:06',245000.00,4.60,89,'2026-04-15 05:48:30','2026-04-15 16:58:05'),(3,7,'Boho Chic Store','boho-chic-store','Free-spirited fashion for the modern bohemian. Featuring flowy fabrics, earthy tones, and festival-ready looks.',NULL,NULL,'riya@bohochicstore.com','9876501002','15, Linking Road','Mumbai','Maharashtra','400050',NULL,NULL,NULL,NULL,NULL,10.00,1,'2026-04-15 05:48:30',312000.00,4.80,134,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(4,8,'Desi Vibes','desi-vibes','Where Indian roots meet global trends. Fusion fashion that celebrates the beauty of India in every thread.',NULL,NULL,'meera@desivibes.com','9876501003','7, Commercial Street','Bengaluru','Karnataka','560001',NULL,NULL,NULL,NULL,NULL,10.00,1,'2026-04-15 05:48:30',189000.00,4.50,72,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(5,9,'Royal Weaves','royal-weaves','Premium handloom and silk sarees, kurtas, and lehengas. Celebrating the rich weaving traditions of India.',NULL,NULL,'anjali@royalweaves.com','9876501004','88, Hazratganj','Lucknow','Uttar Pradesh','226001',NULL,NULL,NULL,NULL,NULL,10.00,1,'2026-04-15 05:48:30',421000.00,4.90,201,'2026-04-15 05:48:30','2026-04-15 05:48:30'),(6,10,'South Silks','south-silks','Authentic Kanjivaram, Mysore and Chanderi silks. Luxury ethnic wear for weddings and special occasions.',NULL,NULL,'kavya@southsilks.com','9876501005','23, T. Nagar','Chennai','Tamil Nadu','600017',NULL,NULL,NULL,NULL,NULL,10.00,1,'2026-04-15 05:48:30',567000.00,4.70,178,'2026-04-15 05:48:30','2026-04-15 05:48:30');
/*!40000 ALTER TABLE `vendor_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wishlist` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (1,5,23,'2026-04-15 07:53:51'),(3,3,23,'2026-04-15 07:55:30'),(4,3,1,'2026-04-15 10:28:13');
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-25 11:04:36
