<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = explode('/', trim($uri, '/'));

if (!isset($path[1]) || $path[1] !== 'groups') {
    echo json_encode(['error' => 'Invalid route']);
    exit;
}

switch($method) {
    case "GET":
        $year = $_GET['year'] ?? null;
        if ($year) {
            $stmt = $conn->prepare("SELECT * FROM `groups` WHERE year = :year");
            $stmt->bindParam(':year', $year);
            $stmt->execute();
            $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($groups as &$group) {
                $stmt2 = $conn->prepare("SELECT * FROM group_members WHERE group_id = :group_id");
                $stmt2->bindParam(':group_id', $group['id']);
                $stmt2->execute();
                $group['members'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            }

            echo json_encode($groups);
        } else {
            echo json_encode(['error' => 'Missing year parameter']);
        }
        break;

    case "POST":
        if (!isset($_POST['project_title'])) {
            echo json_encode(['success' => false, 'message' => 'Missing form data']);
            exit;
        }

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

        $proposalPath = saveFile("proposal_file");
        $midPath = saveFile("mid_file");
        $finalPath = saveFile("final_file");

        $members = isset($_POST['members']) ? json_decode($_POST['members'], true) : [];

        $sql = "INSERT INTO `groups` 
        (project_title, tech_stack, year, bs_program, project_type, defense_doc, mid_doc, final_doc, supervisor, advisor, co_advisor,
        proposal_remarks, mid_remarks, final_remarks, proposal_file, mid_file, final_file) 
        VALUES 
        (:project_title, :tech_stack, :year, :bs_program, :project_type, :defense_doc, :mid_doc, :final_doc, :supervisor, :advisor, :co_advisor,
        :proposal_remarks, :mid_remarks, :final_remarks, :proposal_file, :mid_file, :final_file)";
        

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':project_title', $_POST['project_title']);
        $stmt->bindParam(':tech_stack', $_POST['tech_stack']);
        $stmt->bindParam(':year', $_POST['year']);
        $stmt->bindParam(':defense_doc', $_POST['defense_doc']);
        $stmt->bindParam(':mid_doc', $_POST['mid_doc']);
        $stmt->bindParam(':final_doc', $_POST['final_doc']);
        $stmt->bindParam(':supervisor', $_POST['supervisor']);
        $stmt->bindParam(':advisor', $_POST['advisor']);
        $stmt->bindParam(':co_advisor', $_POST['co_advisor']);
        $stmt->bindParam(':proposal_remarks', $_POST['proposal_remarks']);
        $stmt->bindParam(':mid_remarks', $_POST['mid_remarks']);
        $stmt->bindParam(':final_remarks', $_POST['final_remarks']);
        $stmt->bindParam(':proposal_file', $proposalPath);
        $stmt->bindParam(':mid_file', $midPath);
        $stmt->bindParam(':final_file', $finalPath);
        $stmt->bindParam(':bs_program', $_POST['bs_program']);
        $stmt->bindParam(':project_type', $_POST['project_type']);


        if ($stmt->execute()) {
            $group_id = $conn->lastInsertId();
            $success = true;

            foreach ($members as $member) {
                $stmt2 = $conn->prepare("INSERT INTO group_members (group_id, name, reg_no, phone, email) VALUES (:group_id, :name, :reg_no, :phone, :email)");
                $stmt2->bindParam(':group_id', $group_id);
                $stmt2->bindParam(':name', $member['name']);
                $stmt2->bindParam(':reg_no', $member['reg_no']);
                $stmt2->bindParam(':phone', $member['phone']);
                $stmt2->bindParam(':email', $member['email']);
                if (!$stmt2->execute()) {
                    $success = false;
                    break;
                }
            }

            echo json_encode(['success' => $success]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to insert group']);
        }
        break;

    case "DELETE":
        $id = $path[2] ?? null;
        if ($id) {
            // Delete members first
            $stmt = $conn->prepare("DELETE FROM group_members WHERE group_id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Delete group
            $stmt2 = $conn->prepare("DELETE FROM `groups` WHERE id = :id");
            $stmt2->bindParam(':id', $id);
            if ($stmt2->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to delete group']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Missing group ID']);
        }
        break;

        case "PUT":
            $id = $path[2] ?? null;
        
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'Missing group ID']);
                break;
            }
        
            $proposalPath = isset($_FILES['proposal_file']) && $_FILES['proposal_file']['tmp_name']
                ? saveFile("proposal_file")
                : ($_POST['existing_proposal_file'] ?? null);
        
            $midPath = isset($_FILES['mid_file']) && $_FILES['mid_file']['tmp_name']
                ? saveFile("mid_file")
                : ($_POST['existing_mid_file'] ?? null);
        
            $finalPath = isset($_FILES['final_file']) && $_FILES['final_file']['tmp_name']
                ? saveFile("final_file")
                : ($_POST['existing_final_file'] ?? null);
        
            $members = isset($_POST['members']) ? json_decode($_POST['members'], true) : [];
        
            $sql = "UPDATE `groups` SET 
                project_title = :project_title,
                tech_stack = :tech_stack,
                year = :year,
                defense_doc = :defense_doc,
                mid_doc = :mid_doc,
                final_doc = :final_doc,
                supervisor = :supervisor,
                advisor = :advisor,
                co_advisor = :co_advisor,
                proposal_remarks = :proposal_remarks,
                mid_remarks = :mid_remarks,
                final_remarks = :final_remarks,
                proposal_file = :proposal_file,
                mid_file = :mid_file,
                bs_program = :bs_program,
                project_type = :project_type,
                final_file = :final_file
                WHERE id = :id";
        
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':project_title', $_POST['project_title']);
            $stmt->bindParam(':tech_stack', $_POST['tech_stack']);
            $stmt->bindParam(':year', $_POST['year']);
            $stmt->bindParam(':defense_doc', $_POST['defense_doc']);
            $stmt->bindParam(':mid_doc', $_POST['mid_doc']);
            $stmt->bindParam(':final_doc', $_POST['final_doc']);
            $stmt->bindParam(':supervisor', $_POST['supervisor']);
            $stmt->bindParam(':advisor', $_POST['advisor']);
            $stmt->bindParam(':co_advisor', $_POST['co_advisor']);
            $stmt->bindParam(':proposal_remarks', $_POST['proposal_remarks']);
            $stmt->bindParam(':mid_remarks', $_POST['mid_remarks']);
            $stmt->bindParam(':final_remarks', $_POST['final_remarks']);
            $stmt->bindParam(':proposal_file', $proposalPath);
            $stmt->bindParam(':mid_file', $midPath);
            $stmt->bindParam(':final_file', $finalPath);
            $stmt->bindParam(':bs_program', $_POST['bs_program']);
            $stmt->bindParam(':project_type', $_POST['project_type']);

            $stmt->bindParam(':id', $id);
        
            $success = $stmt->execute();
        
            if ($success) {
                $stmtDel = $conn->prepare("DELETE FROM group_members WHERE group_id = :group_id");
                $stmtDel->bindParam(':group_id', $id);
                $stmtDel->execute();
        
                foreach ($members as $member) {
                    $stmt2 = $conn->prepare("INSERT INTO group_members (group_id, name, reg_no, phone, email) VALUES (:group_id, :name, :reg_no, :phone, :email)");
                    $stmt2->bindParam(':group_id', $id);
                    $stmt2->bindParam(':name', $member['name']);
                    $stmt2->bindParam(':reg_no', $member['reg_no']);
                    $stmt2->bindParam(':phone', $member['phone']);
                    $stmt2->bindParam(':email', $member['email']);
                    if (!$stmt2->execute()) {
                        $success = false;
                        break;
                    }
                }
        
                echo json_encode(['success' => $success]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update group']);
            }
            break;
        

    case "OPTIONS":
        // For CORS preflight
        http_response_code(200);
        break;

    default:
        echo json_encode(['error' => 'Method not supported']);
        break;
}
?>
