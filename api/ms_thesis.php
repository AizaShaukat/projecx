<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow CORS for all origins and handle preflight requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = explode('/', trim($uri, '/'));

function saveFile($fileField) {
    if (isset($_FILES[$fileField]) && $_FILES[$fileField]['error'] === UPLOAD_ERR_OK) {
        $targetDir = "uploads/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        $filename = uniqid() . "_" . basename($_FILES[$fileField]["name"]);
        $targetPath = $targetDir . $filename;
        if (move_uploaded_file($_FILES[$fileField]["tmp_name"], $targetPath)) {
            return $targetPath;
        }
    }
    return null;
}

function postVal($key, $default = null) {
    return isset($_POST[$key]) ? $_POST[$key] : $default;
}

switch ($method) {
    case "GET":
        $year = $_GET['year'] ?? null;
        if ($year) {
            $stmt = $conn->prepare("SELECT * FROM ms_thesis WHERE year = :year ORDER BY created_at DESC");
            $stmt->bindParam(':year', $year, PDO::PARAM_INT);
        } else {
            $stmt = $conn->prepare("SELECT * FROM ms_thesis ORDER BY created_at DESC");
        }
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case "POST":
        if (!isset($_POST['student_name']) || empty($_POST['student_name'])) {
            echo json_encode(['success' => false, 'message' => 'Missing student_name']);
            exit;
        }

        $proposalPath = saveFile("proposal_file");
        $midPath = saveFile("progress_file");
        $finalPath = saveFile("final_thesis_file");

        // Assign POST values to variables for bindParam
        $student_name = $_POST['student_name'];
        $reg_no = postVal('reg_no');
        $email = postVal('email');
        $phone = postVal('phone');
        $year = postVal('year');
        $program = postVal('program');
        $thesis_title = postVal('thesis_title');
        $research_area = postVal('research_area');
        $thesis_type = postVal('thesis_type');
        $supervisor_name = postVal('supervisor_name');
        $co_supervisor_name = postVal('co_supervisor_name');
        $proposal_status = postVal('proposal_status');
        $progress_status = postVal('progress_status');
        $final_status = postVal('final_status');
        $proposal_remarks = postVal('proposal_remarks');
        $progress_remarks = postVal('progress_remarks');
        $final_remarks = postVal('final_remarks');
        $thesis1_status = postVal('thesis1_status');
        $thesis2_status = postVal('thesis2_status');

        $sql = "INSERT INTO ms_thesis (
            student_name, reg_no, email, phone, year, program,
            thesis_title, research_area, thesis_type,
            supervisor_name, co_supervisor_name,
            proposal_file, progress_file, final_thesis_file,
            proposal_status, progress_status, final_status,
            proposal_remarks, progress_remarks, final_remarks,
            thesis1_status, thesis2_status
        ) VALUES (
            :student_name, :reg_no, :email, :phone, :year, :program,
            :thesis_title, :research_area, :thesis_type,
            :supervisor_name, :co_supervisor_name,
            :proposal_file, :progress_file, :final_thesis_file,
            :proposal_status, :progress_status, :final_status,
            :proposal_remarks, :progress_remarks, :final_remarks,
            :thesis1_status, :thesis2_status
        )";

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':student_name', $student_name);
        $stmt->bindParam(':reg_no', $reg_no);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':program', $program);
        $stmt->bindParam(':thesis_title', $thesis_title);
        $stmt->bindParam(':research_area', $research_area);
        $stmt->bindParam(':thesis_type', $thesis_type);
        $stmt->bindParam(':supervisor_name', $supervisor_name);
        $stmt->bindParam(':co_supervisor_name', $co_supervisor_name);
        $stmt->bindParam(':proposal_file', $proposalPath);
        $stmt->bindParam(':progress_file', $midPath);
        $stmt->bindParam(':final_thesis_file', $finalPath);
        $stmt->bindParam(':proposal_status', $proposal_status);
        $stmt->bindParam(':progress_status', $progress_status);
        $stmt->bindParam(':final_status', $final_status);
        $stmt->bindParam(':proposal_remarks', $proposal_remarks);
        $stmt->bindParam(':progress_remarks', $progress_remarks);
        $stmt->bindParam(':final_remarks', $final_remarks);
        $stmt->bindParam(':thesis1_status', $thesis1_status);
        $stmt->bindParam(':thesis2_status', $thesis2_status);

        echo json_encode(['success' => $stmt->execute()]);
        break;

        case "PUT":
            $id = $path[2] ?? null;
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'Missing thesis ID']);
                break;
            }
        
            // Parse input data for PUT requests
            parse_str(file_get_contents("php://input"), $putData);
            $data = array_merge($putData, $_FILES);
        
            // Debugging - log received data
            error_log("Received PUT data: " . print_r($data, true));
        
            if (empty($data['student_name'])) {
                echo json_encode(['success' => false, 'message' => 'Student name is required']);
                break;
            }
        
            // Handle file uploads
            $proposalPath = isset($data['proposal_file']) && $data['proposal_file']['error'] === UPLOAD_ERR_OK 
                ? saveFile("proposal_file") 
                : ($data['existing_proposal_file'] ?? null);
            
            $midPath = isset($data['progress_file']) && $data['progress_file']['error'] === UPLOAD_ERR_OK 
                ? saveFile("progress_file") 
                : ($data['existing_progress_file'] ?? null);
            
            $finalPath = isset($data['final_thesis_file']) && $data['final_thesis_file']['error'] === UPLOAD_ERR_OK 
                ? saveFile("final_thesis_file") 
                : ($data['existing_final_thesis_file'] ?? null);
        
            // Prepare SQL statement
            $sql = "UPDATE ms_thesis SET
                student_name = ?,
                reg_no = ?,
                email = ?,
                phone = ?,
                year = ?,
                program = ?,
                thesis_title = ?,
                research_area = ?,
                thesis_type = ?,
                supervisor_name = ?,
                co_supervisor_name = ?,
                proposal_file = ?,
                progress_file = ?,
                final_thesis_file = ?,
                proposal_status = ?,
                progress_status = ?,
                final_status = ?,
                proposal_remarks = ?,
                progress_remarks = ?,
                final_remarks = ?,
                thesis1_status = ?,
                thesis2_status = ?
                WHERE id = ?";
        
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $data['student_name'],
                $data['reg_no'] ?? null,
                $data['email'] ?? null,
                $data['phone'] ?? null,
                $data['year'] ?? null,
                $data['program'] ?? null,
                $data['thesis_title'] ?? null,
                $data['research_area'] ?? null,
                $data['thesis_type'] ?? null,
                $data['supervisor_name'] ?? null,
                $data['co_supervisor_name'] ?? null,
                $proposalPath,
                $midPath,
                $finalPath,
                $data['proposal_status'] ?? null,
                $data['progress_status'] ?? null,
                $data['final_status'] ?? null,
                $data['proposal_remarks'] ?? null,
                $data['progress_remarks'] ?? null,
                $data['final_remarks'] ?? null,
                $data['thesis1_status'] ?? null,
                $data['thesis2_status'] ?? null,
                $id
            ]);
        
            echo json_encode(['success' => true, 'message' => 'Thesis updated successfully']);
            break;

    case "DELETE":
        $id = $path[2] ?? null;
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Missing thesis ID']);
            break;
        }
        $stmt = $conn->prepare("DELETE FROM ms_thesis WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        echo json_encode(['success' => $stmt->execute()]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
        break;
}
?>
