-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 24, 2025 at 04:09 PM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fyp_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int NOT NULL,
  `project_title` varchar(255) NOT NULL,
  `tech_stack` varchar(255) NOT NULL,
  `supervisor` varchar(255) NOT NULL,
  `advisor` varchar(255) NOT NULL,
  `co_advisor` varchar(255) NOT NULL,
  `defense_doc` varchar(50) NOT NULL,
  `mid_doc` varchar(50) NOT NULL,
  `final_doc` varchar(50) NOT NULL,
  `year` int NOT NULL,
  `bs_program` enum('Computer Engineering','Software Engineering','Electrical Engineering') NOT NULL,
  `project_type` enum('Software','Hardware','Software & Hardware') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `proposal_remarks` text,
  `mid_remarks` text,
  `final_remarks` text,
  `proposal_file` varchar(255) DEFAULT NULL,
  `mid_file` varchar(255) DEFAULT NULL,
  `final_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `project_title`, `tech_stack`, `supervisor`, `advisor`, `co_advisor`, `defense_doc`, `mid_doc`, `final_doc`, `year`, `bs_program`, `project_type`, `created_at`, `proposal_remarks`, `mid_remarks`, `final_remarks`, `proposal_file`, `mid_file`, `final_file`) VALUES
(22, 'AI Bot', 'React Native, Java Script, AI/ML', 'Asif ali', 'hb', 'qwewq', 'In Process', 'Incomplete', 'Incomplete', 2023, 'Computer Engineering', 'Software', '2025-06-08 11:15:52', '', '', '', NULL, NULL, NULL),
(23, 'Unity', 'joj', 'joi', 'Dr. Rehan Hafiz', 'qwewq', 'Completed', 'Completed', 'In Process', 2023, 'Computer Engineering', 'Software', '2025-06-08 18:24:37', '', '', '', NULL, NULL, NULL),
(25, 'Transcript Management System', 'React Native, Java Script, AI/ML', 'Asif', 'hb', 'aiza', 'In Process', 'Completed', 'In Process', 2023, 'Software Engineering', 'Hardware', '2025-06-09 07:04:55', '', '', '', NULL, NULL, NULL),
(26, 'Smart Parking System', 'IoT, Node.js', 'Dr. Rehan Hafiz', 'Ms. Sara Ali', 'Mr. Bilal Raza', 'In Process', 'Completed', 'In Process', 2025, 'Software Engineering', 'Hardware', '2025-06-09 10:42:48', '', '', '', NULL, NULL, NULL),
(27, 'Online Voting System', 'PHP, MySQL', 'Mr. Tariq Jameel', 'Dr. Rehan Hafiz', 'Dr. Ali Ahmad', 'In Process', 'In Process', 'In Process', 2025, 'Computer Engineering', 'Software', '2025-06-09 10:43:33', '', '', '', NULL, NULL, NULL),
(28, 'Smart Energy Meter', 'Arduino, C++', 'Dr. Hina Shah', 'Mr. Nasir Mehmood', 'Ms. Zehra Anwar', 'In Process', 'In Process', 'Completed', 2025, 'Electrical Engineering', 'Hardware', '2025-06-09 10:44:21', '', '', '', NULL, NULL, NULL),
(29, 'Drone-Based Delivery System', 'Raspberry Pi, Python, OpenCV', 'Dr. Kamran Yousuf', ' Ms. Areeba Khan', 'Mr. Noman Shah', 'In Process', 'In Process', 'In Process', 2025, 'Electrical Engineering', 'Hardware', '2025-06-09 10:45:14', '', '', '', NULL, NULL, NULL),
(30, 'Banking Management System', 'React Native, Java Script, AI/ML', 'Asif ali', 'Dr. Rehan Hafiz', 'Dr. Ali Ahmad', 'Completed', 'Completed', 'Completed', 2025, 'Computer Engineering', 'Software', '2025-06-09 12:37:09', '', '', '', NULL, NULL, NULL),
(31, 'Online Voting System', 'PHP, MySQL', 'Mr. Tariq Jameel', 'Dr. Rehan Hafiz', 'Dr. Ali Ahmad', 'In Process', 'In Process', 'In Process', 2025, 'Computer Engineering', 'Hardware', '2025-06-12 17:04:33', '', '', '', NULL, NULL, NULL),
(32, 'Serial Mood Analyzer', 'AI, ML', 'Dr. Ali Ahmed', 'Dr. Rehan Hafiz', 'Mr. Usama Bin Shakeel', 'Completed', 'Completed', 'In Process', 2025, 'Computer Engineering', 'Software', '2025-06-15 03:33:11', '', '', '', 'uploads/684e3ef75838d_Aiza Shaukat-agentic.pdf', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `id` int NOT NULL,
  `group_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `reg_no` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `group_members`
--

INSERT INTO `group_members` (`id`, `group_id`, `name`, `reg_no`, `phone`, `email`) VALUES
(35, 22, 'Aiza Shaukat', 'aiza', '03103333429', 'aiza@gmail.com'),
(37, 23, 'aiza', 'BSCE21035', '223', 'aiza@gmail.com'),
(40, 25, 'Raja Ali Akhtar', '2333', '03103333429', 'bsce21031@itu.edu.pk'),
(46, 30, 'Aiza Shaukat', 'BSCE21031', '03103333429', 'bsce21031@itu.edu.pk'),
(47, 27, 'Raja Ali Akhtarr', 'aiza', '2342', 'bsce21016@itu.edu.pk'),
(48, 31, 'Raja Ali Akhtarr', '34234', '34234', 'aiza@gmail.com'),
(49, 31, 'aiza', '2343242', '2423423', 'aiza@gmail.com'),
(50, 29, 'Raja Ali Akhtar', 'BSCE21035', '03103333429', 'bsce21035@itu.edu.pk'),
(51, 28, 'Aiza Shaukat', 'BSCE21031', '223', 'aiza@gmail.com'),
(53, 32, 'Amna Ahmad', 'BSCE21018', '03214422531', 'bsce21018@itu.edu.pk'),
(56, 26, 'Aiza Shaukat', 'BSCE21031', '03103333429', 'bsce21031@itu.edu.pk');

-- --------------------------------------------------------

--
-- Table structure for table `ms_thesis`
--

CREATE TABLE `ms_thesis` (
  `id` int NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `reg_no` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `year` int NOT NULL,
  `program` enum('MS Electrical Engineering','MS Software Engineering','MS Computer Engineering') NOT NULL,
  `thesis_title` varchar(255) NOT NULL,
  `research_area` varchar(255) DEFAULT NULL,
  `thesis_type` enum('Software Based','Hardware Based','Software & Hardware') NOT NULL,
  `supervisor_name` varchar(100) NOT NULL,
  `co_supervisor_name` varchar(100) DEFAULT NULL,
  `proposal_file` varchar(255) DEFAULT NULL,
  `progress_file` varchar(255) DEFAULT NULL,
  `final_thesis_file` varchar(255) DEFAULT NULL,
  `proposal_status` enum('Incomplete','In Process','Completed') DEFAULT 'Incomplete',
  `progress_status` enum('Incomplete','In Process','Completed') DEFAULT 'Incomplete',
  `final_status` enum('Incomplete','In Process','Completed') DEFAULT 'Incomplete',
  `proposal_remarks` text,
  `progress_remarks` text,
  `final_remarks` text,
  `thesis1_status` enum('Not Started','In Progress','Completed') DEFAULT 'Not Started',
  `thesis2_status` enum('Not Started','In Progress','Completed') DEFAULT 'Not Started',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ms_thesis`
--

INSERT INTO `ms_thesis` (`id`, `student_name`, `reg_no`, `email`, `phone`, `year`, `program`, `thesis_title`, `research_area`, `thesis_type`, `supervisor_name`, `co_supervisor_name`, `proposal_file`, `progress_file`, `final_thesis_file`, `proposal_status`, `progress_status`, `final_status`, `proposal_remarks`, `progress_remarks`, `final_remarks`, `thesis1_status`, `thesis2_status`, `created_at`) VALUES
(3, 'Not decided Yet', '1211', 'gymclub@itu.edu.pk', '131', 2025, 'MS Software Engineering', 'Flying Cars', 'Automated Cars', 'Software Based', 'Dr. ali', 'uigiu', NULL, NULL, NULL, 'Incomplete', 'Completed', 'In Process', 'hv', 'bk', 'bj', 'In Progress', 'In Progress', '2025-06-08 19:58:03'),
(8, 'Banking Management System', 'sdad', 'sadsa@GMAIL.COM', 'asdsa', 2025, 'MS Electrical Engineering', 'asda', 'asdasd', 'Software Based', 'asda', 'sadad', NULL, NULL, NULL, 'Completed', 'Incomplete', 'Completed', '', '', '', 'Completed', 'Completed', '2025-06-08 20:56:27'),
(9, 'Aiza Shaukat', 'MSCS23002', 'mscs23002@itu.edu.pk', '03101232323', 2024, 'MS Computer Engineering', 'AI Water Management System', 'AI, React', 'Software Based', 'Dr. Ali Ahmed', '', NULL, NULL, NULL, 'Completed', 'Completed', 'In Process', '', '', '', 'Not Started', 'Not Started', '2025-06-15 02:34:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indexes for table `ms_thesis`
--
ALTER TABLE `ms_thesis`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reg_no` (`reg_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `group_members`
--
ALTER TABLE `group_members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `ms_thesis`
--
ALTER TABLE `ms_thesis`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
